import React from 'react';
import { personalInfo, education, experience, skills } from '../data';

export const PrintableCV = () => {
  return (
    <div 
      id="printable-cv" 
      className="bg-white text-gray-800 font-sans shadow-lg absolute left-[-9999px] top-[-9999px]"
      style={{ 
        boxSizing: 'border-box',
        width: '794px',
        minHeight: '1123px',
        padding: '48px',
        backgroundColor: '#ffffff',
        color: '#1f2937'
      }}
    >
      {/* Header */}
      <div 
        className="flex justify-between items-start pb-6 mb-6"
        style={{ borderBottom: '2px solid #fecdd3' }}
      >
        <div className="w-2/3 pr-6">
          <h1 className="text-4xl font-bold mb-2 tracking-tight" style={{ color: '#9f1239' }}>{personalInfo.name}</h1>
          <p className="text-lg font-semibold mb-3" style={{ color: '#e11d48' }}>{personalInfo.role}</p>
          <p className="text-sm leading-relaxed text-justify" style={{ color: '#4b5563' }}>{personalInfo.summary}</p>
        </div>
        <div className="w-1/3 text-right text-xs leading-relaxed flex flex-col gap-2 pt-1" style={{ color: '#4b5563' }}>
          <p className="font-medium" style={{ color: '#111827' }}>{personalInfo.phone}</p>
          <p>{personalInfo.email}</p>
          <p>{personalInfo.address}</p>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Left Column */}
        <div className="w-1/3 flex flex-col gap-6">
          <section>
            <h2 
              className="text-lg font-bold pb-2 mb-3 tracking-wide uppercase text-xs" 
              style={{ color: '#9f1239', borderBottom: '1.5px solid #fecdd3' }}
            >
              Keahlian
            </h2>
            <ul className="text-sm flex flex-col gap-2" style={{ color: '#374151' }}>
              {skills.map((skill, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#e11d48' }}></span>
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 
              className="text-lg font-bold pb-2 mb-3 tracking-wide uppercase text-xs" 
              style={{ color: '#9f1239', borderBottom: '1.5px solid #fecdd3' }}
            >
              Pendidikan
            </h2>
            <div className="flex flex-col gap-4">
              {education.map((edu, index) => (
                <div key={index}>
                  <h3 className="font-bold text-sm" style={{ color: '#111827' }}>{edu.institution}</h3>
                  {edu.degree && <p className="text-xs font-semibold" style={{ color: '#e11d48' }}>{edu.degree}</p>}
                  <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{edu.period}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="w-2/3 flex flex-col gap-6">
          <section>
            <h2 
              className="text-lg font-bold pb-2 mb-4 tracking-wide uppercase text-xs" 
              style={{ color: '#9f1239', borderBottom: '1.5px solid #fecdd3' }}
            >
              Pengalaman Kerja
            </h2>
            <div className="flex flex-col gap-6">
              {experience.map((exp, index) => (
                <div key={index} style={{ borderBottom: index < experience.length - 1 ? '1px dashed #f3f4f6' : 'none', paddingBottom: index < experience.length - 1 ? '16px' : '0' }}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-base" style={{ color: '#111827' }}>{exp.role}</h3>
                      <p className="font-semibold text-sm" style={{ color: '#e11d48' }}>{exp.company}</p>
                    </div>
                    <span 
                      className="text-xs font-bold px-2.5 py-1 rounded" 
                      style={{ backgroundColor: '#fff1f2', color: '#be123c', border: '1px solid #ffe4e6' }}
                    >
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-justify mt-2" style={{ color: '#4b5563' }}>
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

