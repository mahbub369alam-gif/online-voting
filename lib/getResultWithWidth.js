// input: array of candidate objects (as you provided)
// output: new array where each object gets a `width` property like "75.00%"
export function getResultWithWidth(candidates) {
  // 1) votes কে number হিসেবে নাও (null বা undefined হলে 0 ধরা হবে)
  const votesArr = candidates.map((c) => Number(c.votes) || 0);

  // 2) সর্বোচ্চ votes খুঁজে নাও
  const maxVotes = Math.max(...votesArr);

  // 3) যদি maxVotes == 0 হয় (মানে কেউ ভোট পায়নি), সবগুলোর width "0.00%" রাখবে
  if (maxVotes === 0) {
    return candidates.map((c) => ({ ...c, width: "0.00%" }));
  }

  // 4) অন্যথায় প্রত্যেকের width = (votes / maxVotes) * 100  — two-decimal precision
  return candidates.map((c) => {
    const v = Number(c.votes) || 0;
    // গণনা করে দুটি দশমিক পর্যন্ত গড়ানো
    const pct = Math.round((v / maxVotes) * 10000) / 100;
    // winner(es) যাদের v === maxVotes, তাদের pct নিশ্চিত 100 করে দেবে (যদি রাউন্ডিং কোনো কারণে 99.99 করে)
    const finalPct = v === maxVotes ? 100 : pct;
    // স্ট্রিং হিসেবে "%"-সহ ফেরত দাও
    return { ...c, width: finalPct.toFixed(2) };
  });
}
