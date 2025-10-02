'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Search, 
  Calendar, 
  User, 
  FileDown, 
  Eye,
  TrendingUp,
  Package2,
  Activity
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface MaterialData {
  materialId: string;
  materialName: string;
  materialType: string;
  quantity: number;
  createdAt: string;
  appointmentId: string;
  appointmentDescription: string;
  appointmentDate: string;
  appointmentTime: string;
  patient: {
    _id: string;
    nombre: string;
    email: string;
    telefono: string;
  } | null;
  confirmed: boolean;
}

interface MaterialSummary {
  name: string;
  type: string;
  totalQuantity: number;
  usageCount: number;
  lastUsed: string;
}

interface MaterialsResponse {
  materials: MaterialData[];
  summary: MaterialSummary[];
  totalMaterials: number;
  totalAppointments: number;
  totalUniqueTypes: number;
}

export default function MaterialesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [materialsData, setMaterialsData] = useState<MaterialsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [viewMode, setViewMode] = useState<'detailed' | 'summary'>('summary');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'date'>('quantity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/sign-in');
      return;
    }

    const userRole = (session.user as any)?.role;
    if (userRole !== 'admin') {
      router.push('/home');
      return;
    }

    fetchMaterials();
  }, [session, status, router]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/materials', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/sign-in');
          return;
        }
        throw new Error(data.error || `Error ${response.status}: Error al cargar materiales`);
      }

      setMaterialsData(data);
      setCurrentPage(1); // Reset to first page when data loads
    } catch (err) {
      console.error('Error fetching materials:', err);
      setError(err instanceof Error ? err.message : 'Error de conexión al cargar materiales');
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = materialsData?.materials.filter(material => {
    const matchesSearch = material.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.materialType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.appointmentDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.patient?.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === '' || material.materialType === filterType;
    
    return matchesSearch && matchesType;
  }) || [];

  const sortedFilteredSummary = materialsData?.summary.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === '' || item.type === filterType;
    
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    let compareValue = 0;
    
    switch (sortBy) {
      case 'name':
        compareValue = a.name.localeCompare(b.name);
        break;
      case 'quantity':
        compareValue = a.totalQuantity - b.totalQuantity;
        break;
      case 'date':
        compareValue = new Date(a.lastUsed).getTime() - new Date(b.lastUsed).getTime();
        break;
      default:
        compareValue = a.totalQuantity - b.totalQuantity;
    }
    
    return sortOrder === 'asc' ? compareValue : -compareValue;
  }) || [];

  // Pagination for summary view
  const totalPages = Math.ceil(sortedFilteredSummary.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSummary = sortedFilteredSummary.slice(startIndex, endIndex);

  // Pagination for detailed view
  const totalDetailedPages = Math.ceil(filteredMaterials.length / itemsPerPage);
  const detailedStartIndex = (currentPage - 1) * itemsPerPage;
  const detailedEndIndex = detailedStartIndex + itemsPerPage;
  const paginatedMaterials = filteredMaterials.slice(detailedStartIndex, detailedEndIndex);

  const uniqueTypes = Array.from(new Set(materialsData?.materials.map(m => m.materialType) || []));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLowStockItems = () => {
    if (!materialsData) return [];
    // Consider items with total quantity <= 5 as low stock
    return materialsData.summary.filter(item => item.totalQuantity <= 5);
  };

  const getMostUsedMaterial = () => {
    if (!materialsData || materialsData.summary.length === 0) return null;
    return materialsData.summary.reduce((prev, current) => 
      prev.usageCount > current.usageCount ? prev : current
    );
  };

  const getRecentActivity = () => {
    if (!materialsData) return [];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return materialsData.materials.filter(material => 
      new Date(material.createdAt) >= thirtyDaysAgo
    ).length;
  };

  const exportToCSV = () => {
    if (!materialsData) return;

    const csvData = viewMode === 'detailed' ? 
      filteredMaterials.map((material: MaterialData) => ({
        'Material': material.materialName,
        'Tipo': material.materialType,
        'Cantidad': material.quantity,
        'Fecha Uso': formatDate(material.createdAt),
        'Cita': material.appointmentDescription,
        'Fecha Cita': material.appointmentDate,
        'Paciente': material.patient?.nombre || 'N/A',
        'Estado': material.confirmed ? 'Confirmada' : 'Pendiente'
      })) :
      sortedFilteredSummary.map((item: MaterialSummary) => ({
        'Material': item.name,
        'Tipo': item.type,
        'Cantidad Total': item.totalQuantity,
        'Veces Usado': item.usageCount,
        'Último Uso': formatDate(item.lastUsed)
      }));

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `materiales_${viewMode}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (status === 'loading' || loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando materiales...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!session || (session.user as any)?.role !== 'admin') {
    return null;
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="text-red-600 mb-4">
              <Package className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Error</h1>
            <p className="text-slate-600 mb-6">{error}</p>
            <Button onClick={fetchMaterials} className="bg-slate-900 hover:bg-slate-800">
              Intentar de nuevo
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50">
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <nav className="flex items-center gap-2 text-sm text-slate-600 mb-4">
              <Link href="/admin" className="hover:text-slate-900">Administración</Link>
              <span>/</span>
              <span className="text-slate-900">Materiales y Suministros</span>
            </nav>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Materiales y Suministros
                </h1>
                <p className="text-slate-600">
                  Gestión y seguimiento de materiales utilizados en las citas
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'detailed' ? 'default' : 'outline'}
                  onClick={() => setViewMode('detailed')}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Detallado
                </Button>
                <Button
                  variant={viewMode === 'summary' ? 'default' : 'outline'}
                  onClick={() => setViewMode('summary')}
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  Resumen
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {materialsData && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm">Total Materiales</p>
                      <p className="text-2xl font-bold">{materialsData.totalMaterials}</p>
                    </div>
                    <Package className="w-8 h-8 text-slate-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm">Tipos Únicos</p>
                      <p className="text-2xl font-bold">{materialsData.totalUniqueTypes}</p>
                    </div>
                    <Package2 className="w-8 h-8 text-slate-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm">Stock Bajo</p>
                      <p className="text-2xl font-bold text-orange-600">{getLowStockItems().length}</p>
                      <p className="text-xs text-slate-500">≤ 5 unidades</p>
                    </div>
                    <Activity className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm">Actividad Reciente</p>
                      <p className="text-2xl font-bold text-green-600">{getRecentActivity()}</p>
                      <p className="text-xs text-slate-500">últimos 30 días</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar por material, tipo, descripción o paciente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="w-full md:w-48">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    >
                      <option value="">Todos los tipos</option>
                      {uniqueTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <Button
                    onClick={exportToCSV}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <FileDown className="w-4 h-4" />
                    Exportar CSV
                  </Button>
                </div>
                
                {/* Sorting and pagination controls for summary view */}
                {viewMode === 'summary' && (
                  <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                    <div className="flex gap-2">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'name' | 'quantity' | 'date')}
                        className="px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                      >
                        <option value="quantity">Ordenar por Cantidad</option>
                        <option value="name">Ordenar por Nombre</option>
                        <option value="date">Ordenar por Fecha</option>
                      </select>
                      
                      <Button
                        variant="outline"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="px-3"
                      >
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-sm text-slate-600">Mostrar:</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                      >
                        <option value={5}>5 por página</option>
                        <option value={10}>10 por página</option>
                        <option value={25}>25 por página</option>
                        <option value={50}>50 por página</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          {viewMode === 'detailed' ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Vista Detallada ({filteredMaterials.length} materiales)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredMaterials.length === 0 ? (
                  <div className="text-center py-8 text-slate-600">
                    No se encontraron materiales con los filtros aplicados
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {paginatedMaterials.map((material: MaterialData, index: number) => (
                        <div key={`${material.appointmentId}-${material.materialId}-${index}`} 
                             className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-medium text-slate-900">{material.materialName}</h3>
                                <Badge variant="outline">{material.materialType}</Badge>
                                <span className="text-sm text-slate-600">
                                  Cantidad: {material.quantity}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  <span>{material.patient?.nombre || 'Paciente no disponible'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  <span>{material.appointmentDate} - {material.appointmentTime}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Package className="w-4 h-4" />
                                  <span>Usado el {formatDate(material.createdAt)}</span>
                                </div>
                              </div>
                              
                              <p className="text-sm text-slate-600 mt-2">
                                <strong>Cita:</strong> {material.appointmentDescription}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge variant={material.confirmed ? "default" : "secondary"}>
                                {material.confirmed ? 'Confirmada' : 'Pendiente'}
                              </Badge>
                              <Link href={`/appointments/${material.appointmentId}`}>
                                <Button variant="outline" size="sm">
                                  Ver Cita
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Pagination */}
                    {totalDetailedPages > 1 && (
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-slate-600">
                          Mostrando {detailedStartIndex + 1} - {Math.min(detailedEndIndex, filteredMaterials.length)} de {filteredMaterials.length} materiales
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                          >
                            Anterior
                          </Button>
                          
                          <span className="text-sm text-slate-600">
                            Página {currentPage} de {totalDetailedPages}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.min(totalDetailedPages, currentPage + 1))}
                            disabled={currentPage === totalDetailedPages}
                          >
                            Siguiente
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Inventario de Materiales ({sortedFilteredSummary.length} tipos)
                  </div>
                  {getLowStockItems().length > 0 && (
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      {getLowStockItems().length} con stock bajo
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sortedFilteredSummary.length === 0 ? (
                  <div className="text-center py-8 text-slate-600">
                    No se encontraron materiales con los filtros aplicados
                  </div>
                ) : (
                  <>
                    <div className="grid gap-4 mb-6">
                      {paginatedSummary.map((item: MaterialSummary, index: number) => {
                        const isLowStock = item.totalQuantity <= 5;
                        return (
                          <div key={`${item.name}-${item.type}-${index}`} 
                               className={`border rounded-lg p-4 hover:bg-slate-50 transition-colors ${
                                 isLowStock ? 'border-orange-200 bg-orange-50' : ''
                               }`}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-medium text-slate-900">{item.name}</h3>
                                  <Badge variant="outline">{item.type}</Badge>
                                  {isLowStock && (
                                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                                      Stock Bajo
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-600">
                                  <div>
                                    <span className="font-medium">Cantidad Total:</span> {item.totalQuantity}
                                  </div>
                                  <div>
                                    <span className="font-medium">Veces Usado:</span> {item.usageCount}
                                  </div>
                                  <div>
                                    <span className="font-medium">Último Uso:</span> {formatDate(item.lastUsed)}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className={`text-2xl font-bold ${
                                  isLowStock ? 'text-orange-600' : 'text-slate-900'
                                }`}>
                                  {item.totalQuantity}
                                </div>
                                <div className="text-sm text-slate-600">
                                  unidades totales
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-slate-600">
                          Mostrando {startIndex + 1} - {Math.min(endIndex, sortedFilteredSummary.length)} de {sortedFilteredSummary.length} materiales
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                          >
                            Anterior
                          </Button>
                          
                          <span className="text-sm text-slate-600">
                            Página {currentPage} de {totalPages}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                          >
                            Siguiente
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}