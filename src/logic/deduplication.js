export function deduplicateDocuments(schemes) {
  const docMap = new Map();

  schemes.forEach(scheme => {
    (scheme.documents || []).forEach(doc => {
      if (!docMap.has(doc.id)) {
        docMap.set(doc.id, {
          id: doc.id,
          name: doc.name,
          required: doc.required,
          schemes: [scheme.code || scheme.name],
          status: getInitialDocStatus(doc.id),
          isDigiLockerAvailable: ["aadhaar", "khatauni", "caste_cert"].includes(doc.id),
          fileSize: ["aadhaar", "khatauni"].includes(doc.id) ? "420 KB" : null,
          uploadedAt: ["aadhaar", "khatauni"].includes(doc.id) ? "2024-10-12" : null
        });
      } else {
        const existing = docMap.get(doc.id);
        if (!existing.schemes.includes(scheme.code || scheme.name)) {
          existing.schemes.push(scheme.code || scheme.name);
        }
        if (doc.required) existing.required = true;
      }
    });
  });

  return Array.from(docMap.values());
}

function getInitialDocStatus(docId) {
  if (docId === "aadhaar" || docId === "khatauni") return "verified";
  if (docId === "bank_passbook" || docId === "photo") return "pending";
  return "missing";
}
