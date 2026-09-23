export function generateTemporalRoadmap(schemes) {
  const years = {
    1: {
      year: 1,
      title: "Year 1 (Immediate Payouts & Risk Cover)",
      hindiTitle: "वर्ष 1 (तत्काल भुगतान और जोखिम सुरक्षा)",
      description: "Direct bank transfers, subsidized interest credit, and seasonal weather insurance.",
      totalExpectedBenefit: 0,
      schemes: []
    },
    2: {
      year: 2,
      title: "Year 2 (Capital Upgrades & Water Security)",
      hindiTitle: "वर्ष 2 (पूंजीगत उन्नयन और जल सुरक्षा)",
      description: "Micro-irrigation installation, solar pump grant, and drip conversion.",
      totalExpectedBenefit: 0,
      schemes: []
    },
    3: {
      year: 3,
      title: "Year 3 (Farm Mechanization & Value Addition)",
      hindiTitle: "वर्ष 3 (कृषि यंत्रीकरण और मूल्य संवर्धन)",
      description: "Custom hiring equipment grants and organic soil certification.",
      totalExpectedBenefit: 0,
      schemes: []
    },
    4: {
      year: 4,
      title: "Year 4 (Yield Optimization & Horticulture)",
      hindiTitle: "वर्ष 4 (उत्पादन अनुकूलन और बागवानी)",
      description: "High-density plantation subsidy and cold storage linkage.",
      totalExpectedBenefit: 0,
      schemes: []
    },
    5: {
      year: 5,
      title: "Year 5 (Agri-Business & Sustainable Independence)",
      hindiTitle: "वर्ष 5 (कृषि-व्यवसाय और सतत आत्मनिर्भरता)",
      description: "FPO aggregation benefit and export market tie-up.",
      totalExpectedBenefit: 0,
      schemes: []
    }
  };

  schemes.forEach(scheme => {
    const yr = scheme.roadmapYear || 1;
    if (years[yr]) {
      years[yr].schemes.push(scheme);
      years[yr].totalExpectedBenefit += scheme.payoutAnnual;
    }
  });

  return Object.values(years);
}
