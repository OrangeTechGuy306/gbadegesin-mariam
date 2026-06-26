'use client';

import * as React from 'react';
import { Plus, Edit2, Trash2, X, Briefcase, GraduationCap, Award, Calendar, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { createExperienceAction, updateExperienceAction, deleteExperienceAction } from '@/server/actions/experience';
import { createCertificationAction, updateCertificationAction, deleteCertificationAction } from '@/server/actions/certification';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const experienceFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  company: z.string().min(2, 'Company/Institution must be at least 2 characters'),
  location: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  startDate: z.string().min(4, 'Start date is required (e.g. 2022-01)'),
  endDate: z.string().optional().or(z.literal('')),
  type: z.enum(['work', 'education', 'award']),
  highlights: z.string().optional().or(z.literal('')),
});

type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

const certificationFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Certification Name must be at least 2 characters'),
  organization: z.string().min(2, 'Issuing Organization must be at least 2 characters'),
  issueDate: z.string().min(4, 'Issue Date is required'),
  expirationDate: z.string().optional().or(z.literal('')),
  credentialId: z.string().optional().or(z.literal('')),
  verificationUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  image: z.string().optional().or(z.literal('')),
});

type CertificationFormValues = z.infer<typeof certificationFormSchema>;

interface AdminProfileManagerProps {
  initialExperiences: any[];
  initialCertifications: any[];
}

export function AdminProfileManager({ initialExperiences, initialCertifications }: AdminProfileManagerProps) {
  const [experiences, setExperiences] = React.useState(initialExperiences);
  const [certifications, setCertifications] = React.useState(initialCertifications);
  const [activeTab, setActiveTab] = React.useState<'experience' | 'certification'>('experience');

  // Modal states
  const [isExpModalOpen, setIsExpModalOpen] = React.useState(false);
  const [activeExp, setActiveExp] = React.useState<any | null>(null);
  
  const [isCertModalOpen, setIsCertModalOpen] = React.useState(false);
  const [activeCert, setActiveCert] = React.useState<any | null>(null);

  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  // Forms
  const {
    register: registerExp,
    handleSubmit: handleSubmitExp,
    reset: resetExp,
    formState: { errors: errorsExp, isSubmitting: isSubmittingExp },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
  });

  const {
    register: registerCert,
    handleSubmit: handleSubmitCert,
    reset: resetCert,
    formState: { errors: errorsCert, isSubmitting: isSubmittingCert },
  } = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationFormSchema),
  });

  // Experience handlers
  const openAddExpModal = () => {
    setActiveExp(null);
    resetExp({
      id: '',
      title: '',
      company: '',
      location: '',
      description: '',
      startDate: '',
      endDate: 'Present',
      type: 'work',
      highlights: '',
    });
    setError(null);
    setSuccess(null);
    setIsExpModalOpen(true);
  };

  const openEditExpModal = (exp: any) => {
    setActiveExp(exp);
    resetExp({
      id: exp._id,
      title: exp.title,
      company: exp.company,
      location: exp.location || '',
      description: exp.description || '',
      startDate: exp.startDate,
      endDate: exp.endDate || 'Present',
      type: exp.type || 'work',
      highlights: exp.highlights ? exp.highlights.join('\n') : '',
    });
    setError(null);
    setSuccess(null);
    setIsExpModalOpen(true);
  };

  const onSubmitExp = async (values: ExperienceFormValues) => {
    setError(null);
    setSuccess(null);
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (v !== undefined) fd.append(k, v.toString());
    });

    const result = values.id
      ? await updateExperienceAction(null, fd)
      : await createExperienceAction(null, fd);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(result.success || 'Career timeline item saved successfully!');
      setTimeout(() => {
        setIsExpModalOpen(false);
        window.location.reload();
      }, 800);
    }
  };

  const handleDeleteExp = async (id: string) => {
    if (confirm('Are you sure you want to delete this career timeline item?')) {
      const res = await deleteExperienceAction(id);
      if (res.error) {
        alert(res.error);
      } else {
        setExperiences((prev) => prev.filter((exp) => exp._id !== id));
      }
    }
  };

  // Certification handlers
  const openAddCertModal = () => {
    setActiveCert(null);
    resetCert({
      id: '',
      name: '',
      organization: '',
      issueDate: '',
      expirationDate: 'No Expiration',
      credentialId: '',
      verificationUrl: '',
      image: '/images/cert-placeholder.png',
    });
    setError(null);
    setSuccess(null);
    setIsCertModalOpen(true);
  };

  const openEditCertModal = (cert: any) => {
    setActiveCert(cert);
    resetCert({
      id: cert._id,
      name: cert.name,
      organization: cert.organization,
      issueDate: cert.issueDate,
      expirationDate: cert.expirationDate || 'No Expiration',
      credentialId: cert.credentialId || '',
      verificationUrl: cert.verificationUrl || '',
      image: cert.image || '/images/cert-placeholder.png',
    });
    setError(null);
    setSuccess(null);
    setIsCertModalOpen(true);
  };

  const onSubmitCert = async (values: CertificationFormValues) => {
    setError(null);
    setSuccess(null);
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (v !== undefined) fd.append(k, v.toString());
    });

    const result = values.id
      ? await updateCertificationAction(null, fd)
      : await createCertificationAction(null, fd);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(result.success || 'Certification saved successfully!');
      setTimeout(() => {
        setIsCertModalOpen(false);
        window.location.reload();
      }, 800);
    }
  };

  const handleDeleteCert = async (id: string) => {
    if (confirm('Are you sure you want to delete this certification?')) {
      const res = await deleteCertificationAction(id);
      if (res.error) {
        alert(res.error);
      } else {
        setCertifications((prev) => prev.filter((cert) => cert._id !== id));
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'work':
        return <Briefcase className="w-4 h-4 text-sky-500" />;
      case 'education':
        return <GraduationCap className="w-4 h-4 text-emerald-500" />;
      default:
        return <Award className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Dynamic Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-secondary/20 border border-border/30">
          <button
            onClick={() => setActiveTab('experience')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
              activeTab === 'experience'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Experience & Education
          </button>
          <button
            onClick={() => setActiveTab('certification')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
              activeTab === 'certification'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Certifications
          </button>
        </div>

        {activeTab === 'experience' ? (
          <button
            onClick={openAddExpModal}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:opacity-90 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Experience/Education</span>
          </button>
        ) : (
          <button
            onClick={openAddCertModal}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:opacity-90 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Certification</span>
          </button>
        )}
      </div>

      {/* Main content display based on selected tab */}
      {activeTab === 'experience' ? (
        <div className="grid grid-cols-1 gap-4">
          {experiences.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border/30 rounded-2xl">
              <p className="text-xs text-muted-foreground">No experience or education items found. Add one to get started!</p>
            </div>
          ) : (
            experiences.map((exp) => (
              <div
                key={exp._id}
                className="bg-card border border-border/40 p-5 rounded-2xl flex items-start justify-between shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-start space-x-4">
                  <div className="mt-1.5 p-2 rounded-xl bg-secondary/40 border border-border/20">
                    {getIcon(exp.type)}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-foreground text-sm tracking-tight">{exp.title}</h4>
                      <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {exp.type}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium flex items-center">
                      <span className="text-foreground font-bold">{exp.company}</span>
                      {exp.location && (
                        <>
                          <span className="mx-2 text-border">•</span>
                          <MapPin className="w-3.5 h-3.5 mr-1 text-muted-foreground/60" />
                          <span>{exp.location}</span>
                        </>
                      )}
                    </p>
                    <p className="text-[10px] text-muted-foreground/80 flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-muted-foreground/60" />
                      <span>
                        {exp.startDate} – {exp.endDate}
                      </span>
                    </p>
                    {exp.description && (
                      <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed mt-2">
                        {exp.description}
                      </p>
                    )}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="mt-2 space-y-1 list-disc list-inside text-xs text-muted-foreground/90 pl-1">
                        {exp.highlights.map((item: string, idx: number) => (
                          <li key={idx} className="leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => openEditExpModal(exp)}
                    className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-primary transition-all inline-flex border border-border/20"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteExp(exp._id)}
                    className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive text-destructive hover:text-destructive-foreground transition-all inline-flex border border-destructive/20 hover:border-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-card border border-border/30 rounded-2xl">
              <p className="text-xs text-muted-foreground">No certifications found. Add one to get started!</p>
            </div>
          ) : (
            certifications.map((cert) => (
              <div
                key={cert._id}
                className="bg-card border border-border/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="p-5 space-y-4">
                  {/* Top line with branding */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-border/40 bg-secondary/15 flex items-center justify-center p-2">
                      {cert.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cert.image} alt={cert.organization} className="object-contain w-full h-full max-h-8" />
                      ) : (
                        <ShieldCheck className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => openEditCertModal(cert)}
                        className="p-1.5 rounded-lg bg-secondary/50 hover:bg-secondary text-primary transition-all inline-flex border border-border/20"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteCert(cert._id)}
                        className="p-1.5 rounded-lg bg-destructive/10 hover:bg-destructive text-destructive hover:text-destructive-foreground transition-all inline-flex border border-destructive/20 hover:border-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-foreground text-xs leading-snug tracking-tight">{cert.name}</h4>
                    <p className="text-[11px] text-muted-foreground font-bold">{cert.organization}</p>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-border/10">
                    <p className="text-[10px] text-muted-foreground/80 flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-muted-foreground/50" />
                      <span>Issued: {cert.issueDate}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground/80 flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-muted-foreground/50" />
                      <span>Expires: {cert.expirationDate}</span>
                    </p>
                    {cert.credentialId && (
                      <p className="text-[10px] text-muted-foreground/80 font-mono">
                        ID: {cert.credentialId}
                      </p>
                    )}
                  </div>
                </div>

                {cert.verificationUrl && (
                  <div className="bg-secondary/10 px-5 py-3 border-t border-border/30 flex justify-end">
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-[10px] font-bold text-primary hover:underline"
                    >
                      <span>Verify Credential</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Experience Form Modal */}
      {isExpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-3xl overflow-y-auto border border-border shadow-2xl flex flex-col p-6 space-y-6 max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-border/40 pb-4">
              <h3 className="text-sm font-bold text-foreground">
                {activeExp ? 'Edit Timeline Item' : 'Add Experience/Education'}
              </h3>
              <button
                onClick={() => setIsExpModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold">{error}</div>}
            {success && <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-semibold">{success}</div>}

            <form onSubmit={handleSubmitExp(onSubmitExp)} className="space-y-4">
              <input type="hidden" {...registerExp('id')} />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Title / Role</label>
                  <input
                    type="text"
                    {...registerExp('title')}
                    placeholder="e.g. Lead Data Scientist"
                    className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errorsExp.title && <p className="text-[10px] text-red-500">{errorsExp.title.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Company / School</label>
                  <input
                    type="text"
                    {...registerExp('company')}
                    placeholder="e.g. Google or MIT"
                    className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errorsExp.company && <p className="text-[10px] text-red-500">{errorsExp.company.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Type</label>
                  <select
                    {...registerExp('type')}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="work">Work Experience</option>
                    <option value="education">Education</option>
                    <option value="award">Award / Recognition</option>
                  </select>
                  {errorsExp.type && <p className="text-[10px] text-red-500">{errorsExp.type.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Location</label>
                  <input
                    type="text"
                    {...registerExp('location')}
                    placeholder="e.g. London, UK or Remote"
                    className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Start Date</label>
                  <input
                    type="text"
                    {...registerExp('startDate')}
                    placeholder="e.g. 2022-09"
                    className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errorsExp.startDate && <p className="text-[10px] text-red-500">{errorsExp.startDate.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">End Date</label>
                  <input
                    type="text"
                    {...registerExp('endDate')}
                    placeholder="e.g. 2024-06 or Present"
                    className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Description</label>
                <textarea
                  rows={2}
                  {...registerExp('description')}
                  placeholder="Provide a brief overview of the role..."
                  className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Highlights (One per line)</label>
                <textarea
                  rows={4}
                  {...registerExp('highlights')}
                  placeholder="- Directed migrations to cloud architectures&#10;- Built neural forecasts with 94% accuracy"
                  className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <button
                disabled={isSubmittingExp}
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center space-x-1 shadow-md"
              >
                <span>{isSubmittingExp ? 'Saving Item...' : 'Save Career Timeline Item'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Certification Form Modal */}
      {isCertModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-3xl overflow-y-auto border border-border shadow-2xl flex flex-col p-6 space-y-6 max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-border/40 pb-4">
              <h3 className="text-sm font-bold text-foreground">
                {activeCert ? 'Edit Certification' : 'Add Certification'}
              </h3>
              <button
                onClick={() => setIsCertModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold">{error}</div>}
            {success && <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-semibold">{success}</div>}

            <form onSubmit={handleSubmitCert(onSubmitCert)} className="space-y-4">
              <input type="hidden" {...registerCert('id')} />

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Certification Name</label>
                <input
                  type="text"
                  {...registerCert('name')}
                  placeholder="e.g. AWS Certified Data Engineer"
                  className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errorsCert.name && <p className="text-[10px] text-red-500">{errorsCert.name.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Issuing Organization</label>
                <input
                  type="text"
                  {...registerCert('organization')}
                  placeholder="e.g. Amazon Web Services"
                  className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errorsCert.organization && <p className="text-[10px] text-red-500">{errorsCert.organization.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Issue Date</label>
                  <input
                    type="text"
                    {...registerCert('issueDate')}
                    placeholder="e.g. 2024-05"
                    className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errorsCert.issueDate && <p className="text-[10px] text-red-500">{errorsCert.issueDate.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Expiration Date</label>
                  <input
                    type="text"
                    {...registerCert('expirationDate')}
                    placeholder="e.g. 2027-05 or No Expiration"
                    className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Credential ID</label>
                  <input
                    type="text"
                    {...registerCert('credentialId')}
                    placeholder="e.g. AWS-DE-12345"
                    className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Image/Logo URL</label>
                  <input
                    type="text"
                    {...registerCert('image')}
                    placeholder="/images/aws-logo.png"
                    className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Verification URL</label>
                <input
                  type="text"
                  {...registerCert('verificationUrl')}
                  placeholder="https://credly.com/verify/..."
                  className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errorsCert.verificationUrl && <p className="text-[10px] text-red-500">{errorsCert.verificationUrl.message}</p>}
              </div>

              <button
                disabled={isSubmittingCert}
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center space-x-1 shadow-md"
              >
                <span>{isSubmittingCert ? 'Saving Certification...' : 'Save Certification'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
