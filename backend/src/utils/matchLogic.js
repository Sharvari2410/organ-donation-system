// Simple matching based on blood group and organ
const findMatches = (donors, recipients) => {
  const matches = [];

  for (const recipient of recipients) {
    for (const donor of donors) {
      const isBloodGroupMatch = donor.bloodGroup === recipient.bloodGroup;
      const isOrganMatch =
        donor.organ.toLowerCase() === recipient.requiredOrgan.toLowerCase();

      if (isBloodGroupMatch && isOrganMatch) {
        matches.push({
          donor,
          recipient,
        });
      }
    }
  }

  return matches;
};

module.exports = {
  findMatches,
};
