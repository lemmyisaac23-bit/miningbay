import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../context/AppState";
import { planDockTotal, planShortfall, type Plan } from "../data/plans";

export function useDockLane() {
  const { buyPlan, balanceUsd } = useAppState();
  const navigate = useNavigate();
  const [shortPlan, setShortPlan] = useState<Plan | null>(null);

  function dock(plan: Plan) {
    if (balanceUsd < planDockTotal(plan)) {
      setShortPlan(plan);
      return;
    }
    const res = buyPlan(plan);
    if (!res.ok) {
      setShortPlan(plan);
      return;
    }
    navigate("/app/contracts");
  }

  const shortfall = shortPlan ? planShortfall(shortPlan, balanceUsd) : 0;

  return {
    dock,
    shortPlan,
    balanceUsd,
    closeShort: () => setShortPlan(null),
    goDeposit: () => {
      if (!shortPlan) return;
      navigate("/app/deposit", {
        state: { need: shortfall, planId: shortPlan.id },
      });
    },
    goGateway: () => {
      if (!shortPlan) return;
      navigate(`/app/pay?plan=${shortPlan.id}`);
    },
  };
}
