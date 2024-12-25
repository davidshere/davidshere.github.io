import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from 'src/assets/components/ui/card.tsx';
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
      totalUnits: 75,
      bedroomTypes: ['studio', 'oneBed', 'twoBed'],
      rents: {
        marketRate: { studio: 2800, oneBed: 3250, twoBed: 4500 },
        lowIncome: { studio: 1864, oneBed: 2096, twoBed: 2332 },
        veryLowIncome: { studio: 1195, oneBed: 1332, twoBed: 1473 }
      }
    },
    eightStory: {
      label: '8-Story Midrise',
      totalUnits: 120,
      bedroomTypes: ['studio', 'oneBed', 'twoBed'],
      rents: {
        marketRate: { studio: 2850, oneBed: 3500, twoBed: 4300 },
        lowIncome: { studio: 1864, oneBed: 2096, twoBed: 2332 },
        veryLowIncome: { studio: 1195, oneBed: 1332, twoBed: 1473 }
      }
    },
    highRise: {
      label: '18-Story High-rise',
      totalUnits: 240,
      bedroomTypes: ['studio', 'oneBed', 'twoBed', 'threeBed'],
      rents: {
        marketRate: { studio: 3507.209302, oneBed: 3946.22093, twoBed: 4999.090909, threeBed: 6306.976744 },
        lowIncome: { studio: 1864, oneBed: 2096, twoBed: 2332, threeBed: 2569 },
        veryLowIncome: { studio: 1195, oneBed: 1332, twoBed: 1473, threeBed: 1614 }
      }
    }
  };

  const [developmentType, setDevelopmentType] = useState('singleFamily');
  const [isEditing, setIsEditing] = useState(false);
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
      newInputs.marketRateUnits.oneBed = 4;
      newInputs.marketRateUnits.twoBed = 4;
      newInputs.veryLowIncomeUnits.oneBed = 1;
      newInputs.lowIncomeUnits.twoBed = 1;
    } else if (developmentType === 'sixStory') {
      newInputs.marketRateUnits.studio = 23;
      newInputs.marketRateUnits.oneBed = 35;
      newInputs.marketRateUnits.twoBed = 11;
      newInputs.veryLowIncomeUnits.studio = 2;
      newInputs.veryLowIncomeUnits.oneBed = 3;
      newInputs.veryLowIncomeUnits.twoBed = 1;

    } else if (developmentType === 'eightStory') {
      newInputs.marketRateUnits.studio = 78;
      newInputs.marketRateUnits.oneBed = 20;
      newInputs.marketRateUnits.twoBed = 10;
      newInputs.veryLowIncomeUnits.studio = 9;
      newInputs.veryLowIncomeUnits.oneBed = 2;
      newInputs.veryLowIncomeUnits.twoBed = 1;
    } else if (developmentType === 'highRise') {
      newInputs.marketRateUnits.studio = 16 + 27;
      newInputs.marketRateUnits.oneBed = 41 + 45;
      newInputs.marketRateUnits.twoBed = 16 + 28;
      newInputs.marketRateUnits.threeBed = 21 + 22;
      newInputs.veryLowIncomeUnits.studio = 5;
      newInputs.veryLowIncomeUnits.oneBed = 10;
      newInputs.veryLowIncomeUnits.twoBed = 5;
      newInputs.veryLowIncomeUnits.threeBed = 4;
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

  const bmrPercentage = Math.round(
    (Object.values(inputs.lowIncomeUnits).reduce((sum, count) => sum + count, 0) + 
     Object.values(inputs.veryLowIncomeUnits).reduce((sum, count) => sum + count, 0)) / 
     getTotalUnits() * 100
  );

  const calculate = () => {
    console.log();
    console.log(`Calculating feasibility for ${developmentType}...`);
    const config = developmentTypes[developmentType];
    let totalRevenue = 0;
    let marketRateRevenue = 0;
    let marketRateUnitCount = 0;
    let bmrRevenue = 0;
  
    Object.entries(inputs.marketRateUnits).forEach(([bedType, count]) => {
      if (config.rents.marketRate[bedType]) {
        const revenue = count * config.rents.marketRate[bedType] * 12;
        marketRateRevenue += revenue;
        marketRateUnitCount += count;
        console.log(`Market Rate ${bedType}: ${count} units x $${config.rents.marketRate[bedType]} = $${revenue}/year`);
      }
    });
  
    Object.entries(inputs.lowIncomeUnits).forEach(([bedType, count]) => {
      if (config.rents.lowIncome[bedType]) {
        const revenue = count * config.rents.lowIncome[bedType] * 12;
        bmrRevenue += revenue;  // Add to BMR revenue
        totalRevenue += revenue;
        console.log(`Low Income ${bedType}: ${count} units x $${config.rents.lowIncome[bedType]} = $${revenue}/year`);
      }
    });
  
    Object.entries(inputs.veryLowIncomeUnits).forEach(([bedType, count]) => {
      if (config.rents.veryLowIncome[bedType]) {
        const revenue = count * config.rents.veryLowIncome[bedType] * 12;
        bmrRevenue += revenue;  // Add to BMR revenue
        totalRevenue += revenue;
        console.log(`Very Low Income ${bedType}: ${count} units x $${config.rents.veryLowIncome[bedType]} = $${revenue}/year`);
      }
    });
    
    totalRevenue += marketRateRevenue;
    
    console.log('\nMarket Rate Summary:');
    console.log(`Total Market Rate Revenue: $${marketRateRevenue}`);
    console.log(`Market Rate Unit Count: ${marketRateUnitCount}`);
    console.log(`Market Rate OpEx (30%): $${marketRateRevenue * 0.3}`);
    console.log(`OpEx per Unit: $${(marketRateRevenue * 0.3) / marketRateUnitCount}`);
    
// Avoid division by zero

    const marketRateOpEx = marketRateRevenue * 0.3;
    const opExPerUnit = marketRateUnitCount > 0 ? marketRateOpEx / marketRateUnitCount : 0;
    const totalUnits = getTotalUnits();
    const operatingExpenses = opExPerUnit * totalUnits;

  
    console.log('\nBMR Summary:');
    console.log(`Total BMR Revenue: $${bmrRevenue}`);
    const bmrUnitCount = Object.values(inputs.lowIncomeUnits).reduce((sum, count) => sum + count, 0) +
                        Object.values(inputs.veryLowIncomeUnits).reduce((sum, count) => sum + count, 0);
    console.log(`BMR Unit Count: ${bmrUnitCount}`);
    console.log(`BMR OpEx (using market rate per-unit cost): $${opExPerUnit * bmrUnitCount}`);

    const marketRateVacancy = marketRateRevenue * 0.05; 
    const bmrVacancy = bmrRevenue * 0.025;
    const totalVacancy = marketRateVacancy + bmrVacancy;
    const noi = totalRevenue - totalVacancy - operatingExpenses;

    console.log('\nFinal Numbers:');
    console.log(`Total Revenue: $${totalRevenue}`);
    console.log(`Total Units: ${totalUnits}`);
    console.log(`Market Rate Vacancy (5%): $${marketRateVacancy}`);
    console.log(`BMR Vacancy (2.5%): $${bmrVacancy}`);
    console.log(`Total Vacancy: $${totalVacancy}`);
    console.log(`Operating Expenses: $${operatingExpenses}`);
    console.log(`NOI: $${noi}`);
    

    
    // Development costs based on type
    const costs = {
      singleFamily: 3190996,
      fourplex: 3383921,
      multifamily: 7977994,
      sixStory: 51823948,
      eightStory: 84123175,
      highRise: 194491711
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
      originalUnitsByBedroom.studio = 23 + 2;
      originalUnitsByBedroom.oneBed = 35 + 3;
      originalUnitsByBedroom.twoBed = 11 + 1;
    } else if (developmentType === 'eightStory') {
      originalUnitsByBedroom.studio = 78 + 9;
      originalUnitsByBedroom.oneBed = 20 + 2;
      originalUnitsByBedroom.twoBed = 10 + 1;
    } else if (developmentType === 'highRise') {
      originalUnitsByBedroom.studio = 16 + 27 + 5;
      originalUnitsByBedroom.oneBed = 41 + 45 + 10;
      originalUnitsByBedroom.twoBed = 16 +  + 28 + 5;
      originalUnitsByBedroom.threeBed = 21 + 22+ 4;
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
  <CardHeader className="pb-2">
    <div className="flex justify-between items-center">
      <CardTitle>Unit Mix</CardTitle>
      <div className="flex items-center space-x-2">
        <Percent className="w-4 h-4 text-blue-500" />
        <div>
          <div className="text-sm text-gray-500">BMR Units</div>
          <div className="text-lg font-bold text-right">{bmrPercentage}%</div>
        </div>
      </div>
    </div>
    <button 
      onClick={() => setIsEditing(!isEditing)}
      className="mt-2 text-sm px-4 py-2 rounded-md bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 font-medium w-full sm:w-auto"
    >
      {isEditing ? 'View Summary' : 'Edit Unit Mix'}
    </button>
  </CardHeader>
  <CardContent>
    {isEditing ? (
      // Existing editing interface
      <div className="space-y-6">
        {renderUnitInputs()}
      </div>
    ) : (
<div className="overflow-x-auto">
  <table className="w-full border-collapse">
    <thead>
      <tr>
        <th className="text-left py-3 px-4 border-b-2 border-gray-200 bg-gray-50 font-medium text-gray-600">Unit Type</th>
        <th className="text-right py-3 px-4 border-b-2 border-gray-200 bg-gray-50 font-medium text-gray-600">Market Rate</th>
        <th className="text-right py-3 px-4 border-b-2 border-gray-200 bg-gray-50 font-medium text-gray-600">Low Income</th>
        <th className="text-right py-3 px-4 border-b-2 border-gray-200 bg-gray-50 font-medium text-gray-600">Very Low Income</th>
        <th className="text-right py-3 px-4 border-b-2 border-gray-200 bg-gray-50 font-medium text-gray-600">Total</th>
        <th className="text-right py-3 px-4 border-b-2 border-gray-200 bg-gray-50 font-medium text-gray-600">Required</th>
      </tr>
    </thead>
    <tbody>
      {developmentTypes[developmentType].bedroomTypes.map(bedType => {
        const totalUnits = results.unitsByBedroom[bedType];
        const requiredUnits = results.originalUnitsByBedroom[bedType];
        const isValid = totalUnits === requiredUnits;
        
        return (
          <tr key={bedType} className="hover:bg-gray-50">
            <td className="py-3 px-4 border-b border-gray-200 font-medium">
              {bedType === 'studio' ? 'Studio' : 
               bedType === 'oneBed' ? '1 Bedroom' :
               bedType === 'twoBed' ? '2 Bedroom' : '3 Bedroom'}
            </td>
            <td className="text-right py-3 px-4 border-b border-gray-200">{inputs.marketRateUnits[bedType]}</td>
            <td className="text-right py-3 px-4 border-b border-gray-200">{inputs.lowIncomeUnits[bedType]}</td>
            <td className="text-right py-3 px-4 border-b border-gray-200">{inputs.veryLowIncomeUnits[bedType]}</td>
            <td className={`text-right py-3 px-4 border-b border-gray-200 font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
              {totalUnits}
            </td>
            <td className="text-right py-3 px-4 border-b border-gray-200 text-gray-500">
              {requiredUnits}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>
    )}
  </CardContent>
</Card>

      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Target Yield on Cost</CardTitle>
          <div className="w-32">
            <input
              type="number"
              step="0.5"
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
    <div className="flex flex-col sm:flex-row gap-6">
      <div className="flex items-center space-x-4 flex-1">
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

      <div className="flex items-center space-x-4 flex-1">
        <DollarSign className="w-8 h-8 text-blue-500" />
        <div>
          <div className="text-sm text-gray-500">Net Operating Income</div>
          <div className="text-xl font-bold">
            ${results.noi.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 flex-1">
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