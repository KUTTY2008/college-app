import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db, storage } from '@/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from 'firebase/storage';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { FileText, Upload, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface Certificate {
  id: string;
  uid: string;
  fileURL: string;
  fileName: string;
  uploadedAt: any;
}

export const StudentDashboard: React.FC = () => {
  const { userProfile, currentUser } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, [userProfile]);

  const fetchCertificates = async () => {
    if (!userProfile) return;
    try {
      const q = query(
        collection(db, 'files'),
        where('uid', '==', userProfile.uid)
      );
      const querySnapshot = await getDocs(q);
      const data: Certificate[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Certificate);
      });
      // Sort manually since we didn't add compound index for order yet
      data.sort((a, b) => {
          const dateA = a.uploadedAt?.toDate?.() || new Date(0);
          const dateB = b.uploadedAt?.toDate?.() || new Date(0);
          return dateB.getTime() - dateA.getTime();
      });
      setCertificates(data);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !currentUser) return;

    setUploading(true);
    try {
      // Create a reference to 'students/{uid}/certificates/{fileName}'
      const storageRef = ref(storage, `students/${currentUser.uid}/certificates/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // You can implement progress bar here
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error("Upload failed", error);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Save metadata to Firestore
          await addDoc(collection(db, 'files'), {
            uid: currentUser.uid,
            fileName: file.name,
            fileURL: downloadURL,
            uploadedAt: serverTimestamp(),
            studentName: userProfile?.name,
            rollNumber: userProfile?.rollNumber,
            batch: userProfile?.batch
          });

          setFile(null);
          setUploading(false);
          fetchCertificates();
        }
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">My Certificates</h2>
        <p className="text-slate-400">Manage and upload your academic documents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <GlassCard className="lg:col-span-1 h-fit">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-400" />
            Upload New
          </h3>
          
          <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {file ? (
              <div className="text-indigo-400 font-medium">
                {file.name}
                <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="text-slate-400">
                <p className="font-medium">Click to select file</p>
                <p className="text-xs mt-2">PDF, JPG, PNG (Max 5MB)</p>
              </div>
            )}
          </div>

          <Button 
            className="w-full mt-6" 
            disabled={!file || uploading}
            isLoading={uploading}
            onClick={handleUpload}
          >
            {uploading ? 'Uploading...' : 'Upload Certificate'}
          </Button>
        </GlassCard>

        {/* List Section */}
        <div className="lg:col-span-2 space-y-4">
          {certificates.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No certificates uploaded yet.
            </div>
          ) : (
            certificates.map((cert) => (
              <GlassCard key={cert.id} className="flex items-center justify-between p-4" hoverEffect>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{cert.fileName}</h4>
                    <p className="text-xs text-slate-400">
                      Uploaded on {cert.uploadedAt?.toDate ? format(cert.uploadedAt.toDate(), 'PPP') : 'Just now'}
                    </p>
                  </div>
                </div>
                
                <a 
                  href={cert.fileURL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
