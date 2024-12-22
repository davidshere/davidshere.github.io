import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Building2, DollarSign, Percent } from 'lucide-react';

const DevelopmentCalculator = () => {
  const developmentTypes = {
    singleFamily: {
      label: 'Single Lot Single Family',
      siteSize: 0.1,
      siteSqFt: 4356,
      totalUnits: 3,
      bedroomTypes: ['threeBed'],
      rents: {
        marketRate: { threeBed: 5500 },
        lowIncome: { threeBed: 2569 },
        veryLowIncome: { threeBed: 1614 }
      }
    },
    fourplex: {
      label: 'Fourplex/Townhomes',
      siteSize: 0.1,
      siteSqFt: 4356,
      totalUnits: 4,
      bedroomTypes: ['twoBed'],
      rents: {
        marketRate: { twoBed: 4000 },
        lowIncome: { twoBed: 2332 },
        veryLowIncome: { twoBed: 1473 }
      }
    },
    multifamily: {
      label: '3 Story Multifamily',
      siteSize: 0.2,
      siteSqFt: 8712,
      totalUnits: 10,
      bedroomTypes: ['oneBed', 'twoBed'],
      rents: {
        marketRate: { oneBed: 3000, twoBed: 4100 },
        lowIncome: { oneBed: 2096, twoBed: 2332 },
        veryLowIncome: { oneBed: 1332, twoBed: 1473 }
      }
    }
  };

  const [developmentType, setDevelopmentType] = useState('singleFamily');
  const [targetYield, setTargetYield] = useState(6.0);
  const [inputs, setInputs] = useState({
    marketRateUnits: {
      oneBed: 0,
      twoBed: 0,
      threeBed: 3
    },
    lowIncomeUnits: {
      oneBed: 0,
      twoBed: 0,
      threeBed: 0
    },
    veryLowIncomeUnits: {
      oneBed: 0,
      twoBed: 0,
      threeBed: 0
    }
  });

  // Update unit counts when development type changes
  useEffect(() => {
    const defaultUnits = {
      oneBed: 0,
      twoBed: 0,
      threeBed: 0
    };

    if (developmentType === 'singleFamily') {
      setInputs({
        marketRateUnits: { ...defaultUnits, threeBed: 3 },
        lowIncomeUnits: { ...defaultUnits },
        veryLowIncomeUnits: { ...defaultUnits }
      });
    } else if (developmentType === 'fourplex') {
      setInputs({
        marketRateUnits: { ...defaultUnits, twoBed: 4 },
        lowIncomeUnits: { ...defaultUnits },
        veryLowIncomeUnits: { ...defaultUnits }
      });
    } else {
      setInputs({
        marketRateUnits: { ...defaultUnits, oneBed: 2, twoBed: 2 },
        lowIncomeUnits: { ...defaultUnits, oneBed: 1, twoBed: 2 },
        veryLowIncomeUnits: { ...defaultUnits, oneBed: 1, twoBed: 2 }
      });
    }
  }, [developmentType]);

  const getTotalUnits = () => {
    const sumByType = (type) =>
      Object.values(inputs[type]).reduce((sum, count) => sum + count, 0);
      
    return sumByType('marketRateUnits') + 
           sumByType('lowIncomeUnits') + 
           sumByType('veryLowIncomeUnits');
  };

  const calculate = () => {
    const config = developmentTypes[developmentType];
    let totalRevenue = 0;

    // Calculate revenue for each unit type and bedroom count
    Object.entries(inputs.marketRateUnits).forEach(([bedType, count]) => {
      if (config.rents.marketRate[bedType]) {
        totalRevenue += count * config.rents.marketRate[bedType] * 12;
      }
    });

    Object.entries(inputs.lowIncomeUnits).forEach(([bedType, count]) => {
      if (config.rents.lowIncome[bedType]) {
        totalRevenue += count * config.rents.lowIncome[bedType] * 12;
      }
    });

    Object.entries(inputs.veryLowIncomeUnits).forEach(([bedType, count]) => {
      if (config.rents.veryLowIncome[bedType]) {
        totalRevenue += count * config.rents.veryLowIncome[bedType] * 12;
      }
    });
    
    // Vacancy and expenses
    const vacancy = totalRevenue * 0.05;
    const operatingExpenses = totalRevenue * 0.3;
    const noi = totalRevenue - vacancy - operatingExpenses;
    
    // Development costs
    const landCosts = config.siteSqFt * 150; // $150 per sq ft
    const demolitionCosts = config.siteSqFt * 20; // $20 per sq ft
    const constructionCosts = config.siteSqFt * 400; // $400 per sq ft
    const parkingCosts = getTotalUnits() * 30000; // $30,000 per space
    
    const hardCosts = demolitionCosts + constructionCosts + parkingCosts;
    const softCosts = hardCosts * 0.13;
    const contingency = (hardCosts + softCosts) * 0.05;
    
    const totalDevelopmentCost = landCosts + hardCosts + softCosts + contingency;
    
    // Financial metrics
    const yieldOnCost = (noi / totalDevelopmentCost) * 100;
    const yieldDifference = targetYield - yieldOnCost;
    const isFeasible = yieldOnCost >= targetYield;
    
    return {
      noi,
      totalDevelopmentCost,
      yieldOnCost,
      yieldDifference,
      totalUnits: getTotalUnits(),
      targetUnits: config.totalUnits
    };
  };

  const results = calculate();

  const handleInputChange = (unitType, bedType, value) => {
    const newValue = parseInt(value) || 0;
    setInputs(prev => ({
      ...prev,
      [unitType]: {
        ...prev[unitType],
        [bedType]: newValue
      }
    }));
  };

  const renderUnitInputs = () => {
    const config = developmentTypes[developmentType];
    const bedTypes = {
      oneBed: '1 Bedroom',
      twoBed: '2 Bedroom',
      threeBed: '3 Bedroom'
    };

    return config.bedroomTypes.map(bedType => (
      <div key={bedType} className="space-y-4">
        <h3 className="font-medium">{bedTypes[bedType]}</h3>
        <div className="space-y-2">
          <div>
            <label className="block text-sm">Market Rate Units</label>
            <input
              type="number"
              min="0"
              className="w-full p-2 border rounded"
              value={inputs.marketRateUnits[bedType]}
              onChange={(e) => handleInputChange('marketRateUnits', bedType, e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm">Low Income Units</label>
            <input
              type="number"
              min="0"
              className="w-full p-2 border rounded"
              value={inputs.lowIncomeUnits[bedType]}
              onChange={(e) => handleInputChange('lowIncomeUnits', bedType, e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm">Very Low Income Units</label>
            <input
              type="number"
              min="0"
              className="w-full p-2 border rounded"
              value={inputs.veryLowIncomeUnits[bedType]}
              onChange={(e) => handleInputChange('veryLowIncomeUnits', bedType, e.target.value)}
            />
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Target Yield on Cost</CardTitle>
          <div className="w-32">
            <input
              type="number"
              step="0.1"
              min="0"
              className="w-full p-2 border rounded text-right"
              value={targetYield}
              onChange={(e) => setTargetYield(parseFloat(e.target.value) || 0)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-sm font-medium ${results.isFeasible ? 'text-green-600' : 'text-red-600'}`}>
            Project is currently {results.isFeasible ? 'feasible' : 'not feasible'} at {targetYield}% target yield
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Development Type</CardTitle>
        </CardHeader>
        <CardContent>
          <select 
            className="w-full p-2 border rounded"
            value={developmentType}
            onChange={(e) => setDevelopmentType(e.target.value)}
          >
            {Object.entries(developmentTypes).map(([key, {label}]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          
          <div className="mt-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Development Type</th>
                  <th className="text-right py-2">Site Size (Acres)</th>
                  <th className="text-right py-2">Site Size (Sq. Ft.)</th>
                  <th className="text-right py-2">Total Units</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(developmentTypes).map(([key, details]) => (
                  <tr key={key} className={`border-b ${key === developmentType ? 'bg-blue-50' : ''}`}>
                    <td className="py-2">{details.label}</td>
                    <td className="text-right py-2">{details.siteSize}</td>
                    <td className="text-right py-2">{details.siteSqFt.toLocaleString()}</td>
                    <td className="text-right py-2">{details.totalUnits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Unit Mix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {renderUnitInputs()}
            <div className={`text-sm mt-2 ${results.totalUnits !== results.targetUnits ? 'text-red-500' : 'text-green-500'}`}>
              Total Units: {results.totalUnits} / {results.targetUnits} Required
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <DollarSign className="w-8 h-8 text-green-500" />
              <div>
                <div className="text-sm text-gray-500">Net Operating Income</div>
                <div className="text-xl font-bold">${results.noi.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Building2 className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-sm text-gray-500">Total Development Cost</div>
                <div className="text-xl font-bold">${results.totalDevelopmentCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Percent className={`w-8 h-8 ${results.isFeasible ? 'text-green-500' : 'text-red-500'}`} />
              <div>
                <div className="text-sm text-gray-500">Yield on Cost</div>
                <div className={`text-xl font-bold ${results.isFeasible ? 'text-green-600' : 'text-red-600'}`}>
                  {results.yieldOnCost.toFixed(2)}%
                </div>
                <div className={`text-sm ${results.isFeasible ? 'text-green-600' : 'text-red-600'}`}>
                  {results.yieldDifference > 0 ? '+' : ''}{results.yieldDifference.toFixed(2)}% vs {targetYield}% target
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DevelopmentCalculator;