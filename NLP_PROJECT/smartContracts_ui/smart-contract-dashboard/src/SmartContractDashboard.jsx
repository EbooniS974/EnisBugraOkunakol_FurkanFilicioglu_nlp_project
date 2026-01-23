import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Shield, Code, FileText, TrendingUp, AlertTriangle, CheckCircle, XCircle, Search } from 'lucide-react';

const SmartContractDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedContract, setSelectedContract] = useState(null);
  const [totalContracts, setTotalContracts] = useState(0);
  const [sampleContracts, setSampleContracts] = useState([]);
  const [theoryData, setTheoryData] = useState([]);
  const [vulnerableCount, setVulnerableCount] = useState(0);
  const [scamCount, setScamCount] = useState(0);
  const [vulnerabilityData, setVulnerabilityData] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState([]);
  const [scamIndicators, setScamIndicators] = useState([]);
  const detailRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/theory_vs_practice")
      .then((res) => res.json())
      .then((data) => {
        setTheoryData(data);
        console.log("Theory vs Practice API data:");
        console.log(data);
        console.log("Theory vs Practice API data end");
      })
      .catch((err) => console.error("Theory vs Practice API error:", err));
  }, []);
  useEffect(() => {
    fetch("http://localhost:8080/api/advanced_scam_results")
      .then(res => res.json())
      .then(data => {
        const contracts = data.contracts.map((item, index) => ({
          id: index + 1,
          name: item.name, // 🔥 project değil
          risk:
            item.risk === "scam"
              ? "high"
              : item.risk === "suspicious"
              ? "medium"
              : "low",
          vulnerabilities: item.vulnerabilities || [],
          trust: item.trust || [],
          score: item.score || 0
        }));
  
        console.log(contracts);
        setSampleContracts(contracts);
  
        // 📊 İSTATİSTİKLER
        const vulnerableContracts = contracts.filter(
          c => c.vulnerabilities.length > 0 || c.risk !== "low"
        ).length;
  
        const scamContracts = contracts.filter(
          c => c.risk === "high"
        ).length;
  
        setVulnerableCount(vulnerableContracts);
        setScamCount(scamContracts);
  
        const lowRisk = contracts.filter(c => c.risk === "low").length;
        const mediumRisk = contracts.filter(c => c.risk === "medium").length;
        const highRisk = contracts.filter(c => c.risk === "high").length;
  
        setRiskDistribution([
          { name: "Güvenli", value: lowRisk, color: "#10b981" },
          { name: "Orta Risk", value: mediumRisk, color: "#f59e0b" },
          { name: "Yüksek Risk", value: highRisk, color: "#ef4444" }
        ]);
  
        // 🔍 ZAFİYET SAYIMI
        const vulnCounts = {};
        contracts.forEach(c => {
          c.vulnerabilities.forEach(vuln => {
            const key = vuln.toLowerCase();
            vulnCounts[key] = (vulnCounts[key] || 0) + 1;
          });
        });
  
        const vulnArray = Object.entries(vulnCounts)
          .map(([name, count]) => ({ name, count, severity: "high" }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
  
        setVulnerabilityData(
          vulnArray.length > 0
            ? vulnArray
            : [{ name: "No vulnerabilities", count: 0 }]
        );
      })
      .catch(err => console.error("API error:", err));
  }, []);
  
  useEffect(() => {
    fetch("http://localhost:8080/api/total_analyses")
      .then(res => res.json())
      .then(data => {
        setTotalContracts(data.total_analyses);
        console.log(data.total_analyses);
      })
      .catch(err => console.error(err));
  }, []);

  const topicTrends = [
    { month: 'Oca', reentrancy: 45, flashLoan: 23, oracle: 12 },
    { month: 'Şub', reentrancy: 52, flashLoan: 31, oracle: 18 },
    { month: 'Mar', reentrancy: 48, flashLoan: 45, oracle: 25 },
    { month: 'Nis', reentrancy: 55, flashLoan: 52, oracle: 32 },
    { month: 'May', reentrancy: 51, flashLoan: 67, oracle: 41 }
  ];

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskIcon = (risk) => {
    switch(risk) {
      case 'high': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Smart Contract Security Analyzer</h1>
                <p className="text-sm text-gray-500">NLP Tabanlı Güvenlik Analiz Platformu</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="px-3 py-1 bg-blue-50 rounded-full">
                Son Güncelleme: Bugün
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Sözleşme</p>
                <p className="text-2xl font-bold text-gray-900">{totalContracts}</p>
              </div>
              <Code className="w-10 h-10 text-blue-500 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Zafiyetli Kod</p>
                <p className="text-2xl font-bold text-red-600">{vulnerableCount}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-red-500 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dolandırıcılık</p>
                <p className="text-2xl font-bold text-orange-600">{scamCount}</p>
              </div>
              <XCircle className="w-10 h-10 text-orange-500 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Analiz Edilen Makale</p>
                <p className="text-2xl font-bold text-green-600">15</p>
              </div>
              <FileText className="w-10 h-10 text-green-500 opacity-20" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-100 mb-6">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {[
                { id: 'overview', label: 'Genel Bakış', icon: TrendingUp },
                { id: 'code', label: 'Kod Analizi', icon: Code },
                { id: 'scam', label: 'Dolandırıcılık Tespiti', icon: AlertTriangle },
                { id: 'theory', label: 'Teori vs Pratik', icon: FileText }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Risk Dağılımı</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={riskDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {riskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-20">En Yaygın Güvenlik Açıkları</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={vulnerabilityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Akademik Konu Trendleri (Makaleler)</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={topicTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="reentrancy" stroke="#ef4444" name="Reentrancy" />
                      <Line type="monotone" dataKey="flashLoan" stroke="#3b82f6" name="Flash Loan" />
                      <Line type="monotone" dataKey="oracle" stroke="#10b981" name="Oracle Attacks" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === 'code' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Sözleşme adı veya adres ara..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Tüm Riskler</option>
                    <option>Yüksek Risk</option>
                    <option>Orta Risk</option>
                    <option>Düşük Risk</option>
                  </select>
                </div>

                <div className="space-y-3">
                  {sampleContracts.map((contract) => (
                    <div
                      key={contract.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedContract(contract);
                        setTimeout(() => {
                          detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getRiskIcon(contract.risk)}
                          <div>
                            <h4 className="font-semibold text-gray-900">{contract.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-1 text-xs rounded border ${getRiskColor(contract.risk)}`}>
                                {contract.risk === 'high' ? 'Yüksek Risk' : contract.risk === 'medium' ? 'Orta Risk' : 'Güvenli'}
                              </span>
                              {contract.vulnerabilities.length > 0 && (
                                <span className="text-xs text-gray-600">
                                  {contract.vulnerabilities.length} zafiyet tespit edildi
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{contract.score}</div>
                          <div className="text-xs text-gray-500">Güvenlik Skoru</div>
                        </div>
                      </div>
                      {contract.vulnerabilities.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {contract.vulnerabilities.map((vuln, idx) => (
                            <span key={idx} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                              {vuln}
                            </span>
                          ))}
                        </div>
                      )}
                      {contract.trust && contract.trust.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {contract.trust.map((marker, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded border border-green-200"
                            >
                              {marker}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {selectedContract && (
                  <div ref={detailRef} className="mt-6 border-t pt-6 scroll-mt-20">
                    <h3 className="text-lg font-semibold mb-3">Detaylı Analiz: {selectedContract.name}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Risk Profili</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Risk Seviyesi:</span>
                            <span className={`font-semibold ${
                              selectedContract.risk === 'high' ? 'text-red-600' : 
                              selectedContract.risk === 'medium' ? 'text-yellow-600' : 
                              'text-green-600'
                            }`}>
                              {selectedContract.risk === 'high' ? 'Yüksek' : 
                               selectedContract.risk === 'medium' ? 'Orta' : 'Düşük'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Güvenlik Skoru:</span>
                            <span className="font-semibold text-gray-900">{selectedContract.score}/100</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Zafiyet Sayısı:</span>
                            <span className="font-semibold text-gray-900">{selectedContract.vulnerabilities.length}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Tespit Edilen Sorunlar</h4>
                        <div className="space-y-1">
                          {selectedContract.vulnerabilities.length > 0 ? (
                            selectedContract.vulnerabilities.slice(0, 3).map((vuln, idx) => (
                              <div key={idx} className="text-xs text-red-700 flex items-center gap-1">
                                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                {vuln}
                              </div>
                            ))
                          ) : (
                            <div className="text-xs text-green-700">Kritik zafiyet tespit edilmedi</div>
                          )}
                        </div>
                        
                        {selectedContract.trust && selectedContract.trust.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <h4 className="font-semibold text-sm text-green-700 mb-2">✓ Güvenlik İşaretleri</h4>
                            <div className="space-y-1">
                              {selectedContract.trust.slice(0, 3).map((marker, idx) => (
                                <div key={idx} className="text-xs text-green-700 flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  {marker}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <div className="mb-3 text-gray-500">// Tespit edilen güvenlik sorunları:</div>
                      
                      {selectedContract.vulnerabilities.length > 0 ? (
                        <div className="space-y-4">
                          {selectedContract.vulnerabilities.slice(0, 15).map((vuln, idx) => {
                            const vulnLower = vuln.toLowerCase();
                            
                            if (vulnLower.includes('reentrancy') || vulnLower.includes('call')) {
                              return (
                                <div key={idx} className="border-l-2 border-red-500 pl-3">
                                  <div className="text-red-400 mb-1">// ⚠️ {vuln}</div>
                                  <div>function withdraw(uint amount) public &#123;</div>
                                  <div className="ml-4 text-red-400">msg.sender.call&#123;value: amount&#125;(""); // VULNERABLE!</div>
                                  <div className="ml-4 text-gray-500">// State değişikliği çağrıdan SONRA ↓</div>
                                  <div className="ml-4">balances[msg.sender] -= amount;</div>
                                  <div>&#125;</div>
                                </div>
                              );
                            }
                            
                            if (vulnLower.includes('access') || vulnLower.includes('owner') || vulnLower.includes('auth')) {
                              return (
                                <div key={idx} className="border-l-2 border-orange-500 pl-3">
                                  <div className="text-orange-400 mb-1">// ⚠️ {vuln}</div>
                                  <div>function setAdmin(address newAdmin) public &#123;</div>
                                  <div className="ml-4 text-orange-400">// modifier yok! // VULNERABLE!</div>
                                  <div className="ml-4">admin = newAdmin;</div>
                                  <div>&#125;</div>
                                </div>
                              );
                            }
                            
                            if (vulnLower.includes('honeypot') || vulnLower.includes('hidden')) {
                              return (
                                <div key={idx} className="border-l-2 border-yellow-500 pl-3">
                                  <div className="text-yellow-400 mb-1">// ⚠️ {vuln}</div>
                                  <div>function transfer(address to, uint amount) public &#123;</div>
                                  <div className="ml-4 text-yellow-400">require(msg.sender == owner); // SCAM!</div>
                                  <div className="ml-4 text-gray-500">// Sadece owner transfer yapabilir</div>
                                  <div className="ml-4">balances[to] += amount;</div>
                                  <div>&#125;</div>
                                </div>
                              );
                            }
                            
                            if (vulnLower.includes('delegatecall')) {
                              return (
                                <div key={idx} className="border-l-2 border-purple-500 pl-3">
                                  <div className="text-purple-400 mb-1">// ⚠️ {vuln}</div>
                                  <div>function execute(address target, bytes data) public &#123;</div>
                                  <div className="ml-4 text-purple-400">target.delegatecall(data); // DANGEROUS!</div>
                                  <div className="ml-4 text-gray-500">// Storage'ı manipüle edebilir</div>
                                  <div>&#125;</div>
                                </div>
                              );
                            }
                            
                            if (vulnLower.includes('overflow') || vulnLower.includes('arithmetic')) {
                              return (
                                <div key={idx} className="border-l-2 border-pink-500 pl-3">
                                  <div className="text-pink-400 mb-1">// ⚠️ {vuln}</div>
                                  <div>pragma solidity ^0.7.0; // Old version!</div>
                                  <div>function add(uint a, uint b) public &#123;</div>
                                  <div className="ml-4 text-pink-400">return a + b; // No SafeMath! VULNERABLE!</div>
                                  <div>&#125;</div>
                                </div>
                              );
                            }
                            
                            return (
                              <div key={idx} className="border-l-2 border-gray-500 pl-3">
                                <div className="text-gray-400 mb-1">// ⚠️ {vuln}</div>
                                <div className="text-gray-500">// Güvenlik açığı tespit edildi</div>
                                <div className="text-gray-500">// Detaylı analiz gerekiyor</div>
                              </div>
                            );
                          })}
                          
                        </div>
                      ) : (
                        <div className="text-green-400">
                          <div className="mb-1">// ✓ Kritik zafiyet tespit edilmedi</div>
                          <div>function withdraw(uint amount) public &#123;</div>
                          <div className="ml-4 text-green-300">require(balances[msg.sender] &gt;= amount);</div>
                          <div className="ml-4">balances[msg.sender] -= amount;</div>
                          <div className="ml-4">payable(msg.sender).transfer(amount);</div>
                          <div>&#125;</div>
                        </div>
                      )}
                    </div>

                    {selectedContract.vulnerabilities.length > 0 && (
                      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Güvenlik Önerileri
                        </h4>
                        <ul className="space-y-2 text-sm text-blue-800">
                          {selectedContract.vulnerabilities.some(v => v.toLowerCase().includes('reentrancy')) && (
                            <li className="flex items-start gap-2">
                              <span className="text-blue-600 mt-0.5">•</span>
                              <span>Reentrancy Guard kullanın (OpenZeppelin ReentrancyGuard)</span>
                            </li>
                          )}
                          {selectedContract.vulnerabilities.some(v => v.toLowerCase().includes('access') || v.toLowerCase().includes('owner')) && (
                            <li className="flex items-start gap-2">
                              <span className="text-blue-600 mt-0.5">•</span>
                              <span>onlyOwner veya role-based access control ekleyin</span>
                            </li>
                          )}
                          {selectedContract.vulnerabilities.some(v => v.toLowerCase().includes('overflow')) && (
                            <li className="flex items-start gap-2">
                              <span className="text-blue-600 mt-0.5">•</span>
                              <span>Solidity 0.8.0+ kullanın veya SafeMath ekleyin</span>
                            </li>
                          )}
                          {selectedContract.vulnerabilities.some(v => v.toLowerCase().includes('delegatecall')) && (
                            <li className="flex items-start gap-2">
                              <span className="text-blue-600 mt-0.5">•</span>
                              <span>Delegatecall hedeflerini whitelist ile sınırlayın</span>
                            </li>
                          )}
                          {selectedContract.vulnerabilities.some(v => v.toLowerCase().includes('honeypot')) && (
                            <li className="flex items-start gap-2">
                              <span className="text-blue-600 mt-0.5">•</span>
                              <span>🚨 Bu proje potansiyel SCAM! Transfer fonksiyonlarını kontrol edin</span>
                            </li>
                          )}
                          <li className="flex items-start gap-2 pt-2 border-t border-blue-200">
                            <span className="text-blue-600 mt-0.5">💡</span>
                            <span className="font-medium">Profesyonel security audit yaptırın</span>
                          </li>
                        </ul>
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedContract(null)}
                      className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Kapat
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Scam Detection Tab */}
            {activeTab === 'scam' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Dolandırıcılık Göstergeleri</h3>
                  <div className="space-y-3">
                    {scamIndicators.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${item.risk === 'high' ? 'bg-red-500' : 'bg-green-500'}`} />
                          <span className="font-medium">{item.indicator}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">{item.frequency} kez tespit edildi</span>
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${item.risk === 'high' ? 'bg-red-500' : 'bg-green-500'}`}
                              style={{ width: `${Math.min(item.frequency / 2, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-900 mb-1">Sentiment Analizi Bulguları</h4>
                      <p className="text-sm text-yellow-800">
                        {scamCount} proje yüksek risk olarak işaretlendi. Honeypot pattern'leri ve 
                        sahtelik belirtileri içeren projeler otomatik olarak tespit edildi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Theory vs Practice Tab */}
            {activeTab === 'theory' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex gap-3">
                    <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Analiz Özeti</h4>
                      <p className="text-sm text-blue-800">
                        15 akademik makaleden çıkarılan öneriler ile gerçek sözleşme kodlarının karşılaştırması.
                        Teoride çok önerilen ama pratikte az uygulanan güvenlik önlemleri vurgulanmıştır.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Teori-Pratik Gap Analizi</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={theoryData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="topic" type="category" width={150} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="theory" fill="#3b82f6" name="Makalelerde Önem (%)" />
                      <Bar dataKey="practice" fill="#10b981" name="Kodlarda Uygulama (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Detaylı Karşılaştırma</h3>
                  <div className="space-y-3">
                    {theoryData.map((item, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{item.topic}</h4>
                          {item.practice == null ? (
                            <span className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-800">
                              Sadece akademik tema
                            </span>
                          ) : (
                            <span
                              className={`px-3 py-1 text-sm rounded ${
                                item.gap > 40
                                  ? "bg-red-100 text-red-800"
                                  : item.gap > 20
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              Gap: {item.gap}%
                            </span>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 w-24">Teoride:</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${item.theory}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-12 text-right">
                              {item.theory}%
                            </span>
                          </div>

                          {item.practice != null && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600 w-24">Pratikte:</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${item.practice}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium w-12 text-right">
                                {item.practice}%
                              </span>
                            </div>
                          )}

                          {item.practice == null && (
                            <p className="text-xs text-gray-500 mt-1">
                              Bu konu makalelerde araştırma teması olarak geçiyor, gerçek
                              kontratlarda doğrudan ölçülmüyor.
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartContractDashboard;