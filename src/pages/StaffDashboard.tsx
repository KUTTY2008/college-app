import React, { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { GlassCard } from '@/components/ui/GlassCard';
import { FileText, ChevronRight, User } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/utils/cn';

interface Student {
  uid: string;
  name: string;
  email: string;
  batch: string;
  rollNumber: string;
}

interface Certificate {
  id: string;
  fileName: string;
  fileURL: string;
  uploadedAt: any;
}

export const StaffDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [batches, setBatches] = useState<string[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentCertificates, setStudentCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'student')
      );
      const snapshot = await getDocs(q);
      const studentData: Student[] = [];
      const uniqueBatches = new Set<string>();

      snapshot.forEach((doc) => {
        const data = doc.data() as Student;
        studentData.push({ ...data, uid: doc.id });
        if (data.batch) uniqueBatches.add(data.batch);
      });

      setStudents(studentData);
      setBatches(Array.from(uniqueBatches).sort());
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleStudentSelect = async (student: Student) => {
    setSelectedStudent(student);
    setStudentCertificates([]); // Clear previous
    try {
      const q = query(
        collection(db, 'files'),
        where('uid', '==', student.uid)
      );
      const snapshot = await getDocs(q);
      const certs: Certificate[] = [];
      snapshot.forEach((doc) => {
        certs.push({ id: doc.id, ...doc.data() } as Certificate);
      });
      setStudentCertificates(certs);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  const filteredStudents = selectedBatch 
    ? students.filter(s => s.batch === selectedBatch)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Staff Dashboard</h2>
        <p className="text-slate-400">Manage student records and verify documents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
        
        {/* Batch Selection & List */}
        <div className="lg:col-span-3 space-y-4 flex flex-col h-full">
          <GlassCard className="p-4">
            <label className="text-sm font-medium text-slate-300 mb-2 block">Select Batch</label>
            <select 
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedBatch}
              onChange={(e) => {
                setSelectedBatch(e.target.value);
                setSelectedStudent(null);
              }}
            >
              <option value="">-- Choose Batch --</option>
              {batches.map(batch => (
                <option key={batch} value={batch}>{batch}</option>
              ))}
            </select>
          </GlassCard>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {selectedBatch && filteredStudents.map(student => (
              <GlassCard 
                key={student.uid}
                onClick={() => handleStudentSelect(student)}
                className={cn(
                  "p-3 cursor-pointer transition-colors border-l-4",
                  selectedStudent?.uid === student.uid 
                    ? "bg-indigo-600/20 border-l-indigo-500" 
                    : "border-l-transparent hover:bg-slate-800/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-200">{student.name}</h4>
                    <p className="text-xs text-slate-400">{student.rollNumber}</p>
                  </div>
                  <ChevronRight className={cn(
                    "w-4 h-4 text-slate-500",
                    selectedStudent?.uid === student.uid && "text-indigo-400"
                  )} />
                </div>
              </GlassCard>
            ))}
            
            {selectedBatch && filteredStudents.length === 0 && (
              <p className="text-center text-slate-500 text-sm py-4">No students in this batch.</p>
            )}
            
            {!selectedBatch && (
              <div className="flex flex-col items-center justify-center h-40 text-slate-500 text-center p-4">
                <User className="w-8 h-8 mb-2 opacity-50" />
                <p>Select a batch to view students</p>
              </div>
            )}
          </div>
        </div>

        {/* Student Detail View */}
        <div className="lg:col-span-9 h-full">
          {selectedStudent ? (
            <GlassCard className="h-full flex flex-col">
              <div className="border-b border-white/10 pb-6 mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedStudent.name}</h2>
                <div className="flex gap-6 mt-2 text-sm text-slate-400">
                  <p>Roll No: <span className="text-slate-200">{selectedStudent.rollNumber}</span></p>
                  <p>Email: <span className="text-slate-200">{selectedStudent.email}</span></p>
                  <p>Batch: <span className="text-slate-200">{selectedStudent.batch}</span></p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-4">Uploaded Certificates</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-1 content-start">
                {studentCertificates.length > 0 ? (
                  studentCertificates.map(cert => (
                    <div 
                      key={cert.id} 
                      className="bg-slate-800/50 rounded-xl p-4 border border-white/5 hover:border-indigo-500/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                          <FileText className="w-6 h-6" />
                        </div>
                        <a 
                          href={cert.fileURL} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs bg-slate-700 hover:bg-indigo-600 text-white px-2 py-1 rounded transition-colors"
                        >
                          View
                        </a>
                      </div>
                      <p className="font-medium text-slate-200 truncate" title={cert.fileName}>
                        {cert.fileName}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {cert.uploadedAt?.toDate ? format(cert.uploadedAt.toDate(), 'PPP') : 'Unknown Date'}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
                    No certificates uploaded by this student.
                  </div>
                )}
              </div>
            </GlassCard>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
              <User className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg">Select a student to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
