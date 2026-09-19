"""
Smart Slot Recommender
=======================
Ranks available procurement slots and recommends the optimal slot for a farmer.

Design:
- Uses the demand predictions produced by the Chronos-2 Demand Predictor.
- Does NOT load any additional heavy pretrained models.
- Optimizes for minimal farmer wait times and avoids centre crowding by balancing capacity.
"""

from typing import List, Dict, Any, Union


def recommend_procurement_slot(
    available_slots: List[str],
    predicted_demand: Dict[str, int] | List[Dict[str, Any]],
    centre_capacity: int,
    existing_bookings: Dict[str, int],
) -> Dict[str, Any]:
    """
    Ranks available slots based on Chronos-2 predicted demand and procurement centre capacity,
    and returns the best recommended slot.

    Args:
        available_slots: List of selectable slot strings (e.g. ['09:00-10:00', '10:00-11:00']).
        predicted_demand: Either a dict mapping {slot_str: int} or list of dicts from predict_all_slots_demand.
        centre_capacity: Maximum farmer throughput capacity per slot.
        existing_bookings: Map of currently confirmed bookings {slot_str: count}.

    Returns:
        Dictionary adhering to specification:
        {
          "recommended_slot": "10:00-11:00",
          "predicted_demand": 48,
          "reason": "Lower expected congestion"
        }
    """
    if not available_slots:
        raise ValueError("available_slots cannot be empty.")

    # Normalize predicted_demand into a dict {slot_name: demand_int}
    demand_map: Dict[str, int] = {}
    if isinstance(predicted_demand, list):
        for item in predicted_demand:
            slot_key = item.get("slot")
            if slot_key:
                demand_map[slot_key] = int(item.get("predicted_demand", 0))
    elif isinstance(predicted_demand, dict):
        demand_map = {k: int(v) for k, v in predicted_demand.items()}

    capacity = max(1, centre_capacity)
    scored_slots = []

    for slot in available_slots:
        current_booked = existing_bookings.get(slot, 0)
        expected_demand = demand_map.get(slot, 0)

        # Remaining physical slots available right now
        remaining_seats = max(0, capacity - current_booked)

        # Total estimated stress on this slot = existing confirmed + predicted additional demand
        total_projected_load = current_booked + expected_demand
        congestion_ratio = total_projected_load / capacity

        # Penalty if slot is already physically full
        is_physically_full = current_booked >= capacity

        scored_slots.append({
            "slot": slot,
            "predicted_demand": expected_demand,
            "existing_bookings": current_booked,
            "remaining_capacity": remaining_seats,
            "total_projected_load": total_projected_load,
            "congestion_ratio": congestion_ratio,
            "is_physically_full": is_physically_full,
        })

    # Sort available slots:
    # 1. Non-full slots first
    # 2. Lowest congestion ratio (least crowded)
    # 3. Highest remaining physical capacity
    ranked = sorted(
        scored_slots,
        key=lambda s: (
            1 if s["is_physically_full"] else 0,
            s["congestion_ratio"],
            -s["remaining_capacity"],
        ),
    )

    best_candidate = ranked[0]
    rec_slot = best_candidate["slot"]
    rec_demand = best_candidate["predicted_demand"]

    # Formulate precise reason based on capacity and predicted demand
    if best_candidate["is_physically_full"]:
        reason = "Centre operating at full capacity; earliest standby slot selected"
    elif best_candidate["congestion_ratio"] < 0.6:
        reason = "Lower expected congestion"
    elif best_candidate["remaining_capacity"] > (capacity * 0.5):
        reason = "Ample available capacity and low predicted queuing"
    else:
        reason = "Lower expected congestion"

    return {
        "recommended_slot": rec_slot,
        "predicted_demand": rec_demand,
        "reason": reason,
        "ranked_slots": [
            {
                "slot": s["slot"],
                "predicted_demand": s["predicted_demand"],
                "existing_bookings": s["existing_bookings"],
                "remaining_capacity": s["remaining_capacity"],
                "congestion_pct": round(s["congestion_ratio"] * 100, 1),
            }
            for s in ranked
        ],
    }
