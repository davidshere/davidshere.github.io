import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/assets/components/ui/card';
import { Building2, DollarSign, Percent } from 'lucide-react';

const FeasibilityCalculator = () => {
  const developmentTypes = {
    singleFamily: {
      label: 'Single Lot Single Family',
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
      totalUnits: 10,
      bedroomTypes: ['oneBed', 'twoBed'],
      rents: {
        marketRate: { oneBed: 3000, twoBed: 4100 },
        lowIncome: { oneBed: 2096, twoBed: 2332 },
        veryLowIncome: { oneBed: 1332, twoBed: 1473 }
      }
    },
    sixStory: {
      label: '6-Story Midrise',
      totalUnits: 69,
      bedroomTypes: ['studio', 'oneBed', 'twoBed'],
      rents: {
        marketRate: { studio: 2500, oneBed: 3300, twoBed: 4400 },
        lowIncome: { studio: 1800, oneBed: 2096, twoBed: 2332 },
        veryLowIncome: { studio: 1200, oneBed: 1332, twoBed: 1473 }
      }
    },
    eightStory: {
      label: '8-Story Midrise',
      totalUnits: 108,
      bedroomTypes: ['studio', 'oneBed', 'twoBed'],
      rents: {
        marketRate: { studio: 2600, oneBed: 3400, twoBed: 4500 },
        lowIncome: { studio: 1800, oneBed: 2096, twoBed: 2332 },
        veryLowIncome: { studio: 1200, oneBed: 1332, twoBed: 1473 }
      }
    },
    highRise: {
      label: '18-Story High-rise',
      totalUnits: 216,
      bedroomTypes: ['studio', 'oneBed', 'twoBed', 'threeBed'],
      rents: {
        marketRate: { studio: 2800, oneBed: 3600, twoBed: 4700, threeBed: 5800 },
        lowIncome: { studio: 1800, oneBed: 2096, twoBed: 2332, threeBed: 2569 },
        veryLowIncome: { studio: 1200, oneBed: 1332, twoBed: 1473, threeBed: 1614 }
      }
    }
  };

  const [developmentType, setDevelopmentType] = useState('singleFamily');
  const [targetYield, setTargetYield] = useState(6.0);
  const [inputs, setInputs] = useState({
    marketRateUnits: {
      studio: 0,
      oneBed: 0,
      twoBed: 0,
      threeBed: 3
    },
    lowIncomeUnits: {
      studio: 0,
      oneBed: 0,
      twoBed: 0,
      threeBed: 0
    },
    veryLowIncomeUnits: {
      studio: 0,
      oneBed: 0,
      twoBed: 0,
      threeBed: 0
    }
  });

  // Update unit counts when development type changes
  useEffect(() => {
    const defaultUnits = {
      studio: 0,
      oneBed: 0,
      twoBed: 0,
      threeBed: 0
    };

    const newInputs = {
      marketRateUnits: { ...defaultUnits },
      lowIncomeUnits: { ...defaultUnits },
      veryLowIncomeUnits: { ...defaultUnits }
    };

    // Set default unit distribution based on development type
    const config = developmentTypes[developmentType];
    if (developmentType === 'singleFamily') {
      newInputs.marketRateUnits.threeBed = 3;
    } else if (developmentType === 'fourplex') {
      newInputs.marketRateUnits.twoBed = 4;
    } else if (developmentType === 'multifamily') {
      newInputs.marketRateUnits.oneBed = 5;
      newInputs.marketRateUnits.twoBed = 5;
    } else if (developmentType === 'sixStory') {
      newInputs.marketRateUnits.studio = 23;
      newInputs.marketRateUnits.oneBed = 35;
      newInputs.marketRateUnits.twoBed = 11;
    } else if (developmentType === 'eightStory') {
      newInputs.marketRateUnits.studio = 78;
      newInputs.marketRateUnits.oneBed = 20;
      newInputs.marketRateUnits.twoBed = 10;
    } else if (developmentType === 'highRise') {
      newInputs.marketRateUnits.studio = 16;
      newInputs.marketRateUnits.oneBed = 41;
      newInputs.marketRateUnits.twoBed = 16;
      newInputs.marketRateUnits.threeBed = 21;
    }

    setInputs(newInputs);
  }, [developmentType]);

  const getTotalUnits = () => {
    const sumByType = (type) =>
      Object.values(inputs[type]).reduce((sum, count) => sum + count, 0);
      
    return sumByType('marketRateUnits') + 
           sumByType('lowIncomeUnits') + 
           sumByType('veryLowIncomeUnits');
  };

  const getUnitsByBedroom = () => {
    const totals = {
      studio: 0,
      oneBed: 0,
      twoBed: 0,
      threeBed: 0
    };

    ['marketRateUnits', 'lowIncomeUnits', 'veryLowIncomeUnits'].forEach(type => {
      Object.entries(inputs[type]).forEach(([bedType, count]) => {
        totals[bedType] += count;
      });
    });

    return totals;
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
    
    // Calculate market rate revenue and unit count separately
    let marketRateRevenue = 0;
    let marketRateUnitCount = 0;
    
    Object.entries(inputs.marketRateUnits).forEach(([bedType, count]) => {
      if (config.rents.marketRate[bedType]) {
        marketRateRevenue += count * config.rents.marketRate[bedType] * 12;
        marketRateUnitCount += count;
      }
    });
    
    // Calculate operating expenses based on market rate standards
    const marketRateOpEx = marketRateRevenue * 0.3;
    const opExPerUnit = marketRateUnitCount > 0 ? marketRateOpEx / marketRateUnitCount : 0;
    
    // Apply the per-unit operating expenses to all units
    const totalUnits = getTotalUnits();
    const operatingExpenses = opExPerUnit * totalUnits;
    
    // Vacancy still based on total revenue
    const vacancy = totalRevenue * 0.05;
    const noi = totalRevenue - vacancy - operatingExpenses;
    
    // Development costs based on type
    const costs = {
      singleFamily: 3190996,
      fourplex: 3383921,
      multifamily: 7977994,
      sixStory: 52081102,
      eightStory: 84124176,
      highRise: 194518710
    };
    
    const totalDevelopmentCost = costs[developmentType];
    
    // Financial metrics
    const yieldOnCost = (noi / totalDevelopmentCost) * 100;
    const yieldDifference = yieldOnCost - targetYield;
    const isFeasible = yieldOnCost >= targetYield;

    const unitsByBedroom = getUnitsByBedroom();
    const originalUnitsByBedroom = {};
    
    // Get original unit distribution
    config.bedroomTypes.forEach(bedType => {
      originalUnitsByBedroom[bedType] = 0;
    });
    
    if (developmentType === 'singleFamily') {
      originalUnitsByBedroom.threeBed = 3;
    } else if (developmentType === 'fourplex') {
      originalUnitsByBedroom.twoBed = 4;
    } else if (developmentType === 'multifamily') {
      originalUnitsByBedroom.oneBed = 5;
      originalUnitsByBedroom.twoBed = 5;
    } else if (developmentType === 'sixStory') {
      originalUnitsByBedroom.studio = 23;
      originalUnitsByBedroom.oneBed = 35;
      originalUnitsByBedroom.twoBed = 11;
    } else if (developmentType === 'eightStory') {
      originalUnitsByBedroom.studio = 78;
      originalUnitsByBedroom.oneBed = 20;
      originalUnitsByBedroom.twoBed = 10;
    } else if (developmentType === 'highRise') {
      originalUnitsByBedroom.studio = 16;
      originalUnitsByBedroom.oneBed = 41;
      originalUnitsByBedroom.twoBed = 16;
      originalUnitsByBedroom.threeBed = 21;
    }
    
    return {
      noi,
      totalDevelopmentCost,
      yieldOnCost,
      yieldDifference,
      isFeasible,
      totalUnits: getTotalUnits(),
      targetUnits: config.totalUnits,
      unitsByBedroom,
      originalUnitsByBedroom
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
      studio: 'Studio',
      oneBed: '1 Bedroom',
      twoBed: '2 Bedroom',
      threeBed: '3 Bedroom'
    };

    return config.bedroomTypes.map(bedType => {
      const totalUnitsForBedType = results.unitsByBedroom[bedType];
      const originalUnitsForBedType = results.originalUnitsByBedroom[bedType];
      const isValid = totalUnitsForBedType === originalUnitsForBedType;

      return (
        <div key={bedType} className="space-y-2">
          <h3 className="font-medium">{bedTypes[bedType]}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Market Rate</label>
              <input
                type="number"
                min="0"
                className="w-full p-2 border rounded"
                value={inputs.marketRateUnits[bedType]}
                onChange={(e) => handleInputChange('marketRateUnits', bedType, e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Low Income</label>
              <input
                type="number"
                min="0"
                className="w-full p-2 border rounded"
                value={inputs.lowIncomeUnits[bedType]}
                onChange={(e) => handleInputChange('lowIncomeUnits', bedType, e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Very Low Income</label>
              <input
                type="number"
                min="0"
                className="w-full p-2 border rounded"
                value={inputs.veryLowIncomeUnits[bedType]}
                onChange={(e) => handleInputChange('veryLowIncomeUnits', bedType, e.target.value)}
              />
            </div>
          </div>
          <div className={`text-sm ${isValid ? 'text-green-500' : 'text-red-500'}`}>
            Total {bedTypes[bedType]} Units: {totalUnitsForBedType} / {originalUnitsForBedType} Required
          </div>
        </div>
      );
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Development Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <select 
              className="w-full p-2 border rounded"
              value={developmentType}
              onChange={(e) => setDevelopmentType(e.target.value)}
            >
              {Object.entries(developmentTypes).map(([key, details]) => (
                <option key={key} value={key}>
                  {details.label} ({details.totalUnits} Units)
                </option>
              ))}
            </select>
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
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Target Yield on Cost</CardTitle>
          <div className="w-32">
            <input
              type="number"
              step="1"
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
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <DollarSign className="w-8 h-8 text-green-500" />
              <div>
                <div className="text-sm text-gray-500">Yield on Cost</div>
                <div className={`text-xl font-bold ${results.isFeasible ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.round(results.yieldOnCost * 100) / 100}%
                </div>
                <div className={`text-sm ${results.isFeasible ? 'text-green-600' : 'text-red-600'}`}>
                  {results.yieldDifference > 0 ? '+' : ''}{Math.round(results.yieldDifference)}% vs {targetYield}% target
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <DollarSign className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-sm text-gray-500">Net Operating Income</div>
                <div className="text-xl font-bold">
                  ${results.noi.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Building2 className="w-8 h-8 text-purple-500" />
              <div>
                <div className="text-sm text-gray-500">Total Development Cost</div>
                <div className="text-xl font-bold">
                  ${results.totalDevelopmentCost.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeasibilityCalculator;