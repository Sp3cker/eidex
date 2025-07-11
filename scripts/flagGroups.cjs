const trainersData = require("../public/trainers.json");

// 1) flatten every trainer into a single array
const allTrainers = Object.values(trainersData).flat();

// 2) build a map of flag → [trainers...]
const flagGroups = allTrainers.reduce((groups, trainer) => {
  (trainer.aiFlags || []).forEach((flag) => {
    if (!groups[flag]) groups[flag] = [];
    groups[flag].push(trainer.trainerName);
  });
  return groups;
}, {});

// 3) derive counts from that
const flagCounts = Object.fromEntries(
  Object.entries(flagGroups).map(([flag, names]) => [flag, names.length]),
);
function countWithFlag(flags) {
  return allTrainers.filter(
    (trainer) =>
      Array.isArray(trainer.aiFlags) &&
      trainer.aiFlags.includes(flags[0]) &&
      trainer.aiFlags.includes(flags[1]) &&
      trainer.boss === true,
  ).length;
}
function trainersWithFlag(flag) {
  return allTrainers
    .filter((t) => t.aiFlags.includes("OMNISCIENT") === false)
    .filter(
      (trainer) =>
        Array.isArray(trainer.aiFlags) &&
        trainer.aiFlags.includes(flag) === true,
    )
    .map((t) => ({ name: t.id, aiFlags: t.aiFlags }));
}
// ok, so the `isBossTrainer` property doesn't do anything for AI, its more that the `OMNISCIENT` and `
console.log("counts by flag:", flagCounts);
// console.log("trainers grouped by flag:", flagGroups);
// console.log(countWithFlag(["SMART_MON_CHOICES", "OMNISCIENT"]));
// No trainer with `boss: false` has `SMART_SWITCHING` OR `SMART_MON_CHOICES`
console.log(trainersWithFlag("SMART_MON_CHOICES").length);
