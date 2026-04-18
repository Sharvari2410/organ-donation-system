export function buildMatches(donors, recipients) {
  const matches = [];

  for (const recipient of recipients) {
    for (const donor of donors) {
      const bloodMatch = donor.bloodGroup === recipient.bloodGroup;
      const organMatch =
        String(donor.organ).toLowerCase() === String(recipient.requiredOrgan).toLowerCase();

      if (bloodMatch && organMatch) {
        matches.push({ donor, recipient });
      }
    }
  }

  return matches;
}
