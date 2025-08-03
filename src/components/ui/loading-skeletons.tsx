import React from 'react';

// Skeleton básico reutilizable
export const SkeletonLoader = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
  </div>
);

// Skeleton para información de paciente
export const PatientInfoSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 animate-pulse">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-5 h-5 bg-gray-200 rounded"></div>
      <div className="h-6 bg-gray-200 rounded w-40"></div>
    </div>
    <div className="space-y-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center">
          <div className="h-4 bg-gray-200 rounded w-20 mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      ))}
    </div>
  </div>
);

// Skeleton para tarjeta de acción
export const ActionCardSkeleton = () => (
  <div className="bg-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg animate-pulse">
    <div className="w-10 h-10 bg-gray-300 rounded mb-4"></div>
    <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
    <div className="h-10 bg-gray-300 rounded w-full mt-2"></div>
  </div>
);

// Skeleton para página completa de paciente
export const PatientPageSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-white px-6 py-12 font-[var(--font-dmsans)]">
    <div className="max-w-6xl mx-auto">
      <header className="mb-12 text-center">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="col-span-2">
          <PatientInfoSkeleton />
        </div>
        <ActionCardSkeleton />
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="h-5 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </section>
    </div>
  </div>
);

// Skeleton para texto inline
export const InlineTextSkeleton = ({ width = "w-32" }: { width?: string }) => (
  <div className={`inline-block h-4 bg-gray-200 rounded animate-pulse ${width}`}></div>
);

// Skeleton para tarjeta de datos (genérico)
export const DataCardSkeleton = ({ rows = 4 }: { rows?: number }) => (
  <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 animate-pulse">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-5 h-5 bg-gray-200 rounded"></div>
      <div className="h-6 bg-gray-200 rounded w-40"></div>
    </div>
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
      ))}
    </div>
  </div>
);

// Skeleton para tabla
export const TableSkeleton = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => (
  <div className="overflow-x-auto bg-white shadow-lg border border-gray-200 rounded-xl">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {[...Array(cols)].map((_, i) => (
            <th key={i} className="px-6 py-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {[...Array(rows)].map((_, rowIndex) => (
          <tr key={rowIndex}>
            {[...Array(cols)].map((_, colIndex) => (
              <td key={colIndex} className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Skeleton para botón
export const ButtonSkeleton = ({ className = "w-full h-10" }: { className?: string }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${className}`}></div>
);
