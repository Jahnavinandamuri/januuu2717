import axios from "axios";

const baseUrl = "http://localhost:3000";

interface Workplace {
  id: number;
  name: string;
}

interface Shift {
  cancelledAt: string | null;
  workerId: number | null;
}

async function getTopWorkplaces() {
  try {
    const workplacesRes = await axios.get<{ data: Workplace[] }>(`${baseUrl}/workplaces`);
    const workplaces = workplacesRes.data.data;

    const workplaceShiftCounts: { name: string; shifts: number }[] = [];

    for (const wp of workplaces) {
      const shiftsRes = await axios.get<{ data: Shift[] }>(`${baseUrl}/shifts?workplaceId=${wp.id}`);
      const shifts = shiftsRes.data.data;

      const completedShifts = shifts.filter(
        (shift) => shift.cancelledAt === null && shift.workerId !== null
      );

      workplaceShiftCounts.push({
        name: wp.name,
        shifts: completedShifts.length,
      });
    }

    const sorted = workplaceShiftCounts.sort((a, b) => b.shifts - a.shifts);
    const top3 = sorted.slice(0, 3);

    // ✅ Strict JSON output required
    console.log(JSON.stringify(top3, null, 2));
  } catch {
    process.exit(1);
  }
}

getTopWorkplaces();
