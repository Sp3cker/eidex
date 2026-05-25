import { caughtEncounterStore } from "@/stores/caughtEncounterStore";
import { useEffect } from "react";
import { cancelIdleTask, scheduleIdleTask } from "@/lib/scheduleIdleTask";

export default function CaughtStoreLoader() {
  useEffect(() => {
    const id = scheduleIdleTask(() => {
      void caughtEncounterStore.getState().beginLazyLoad();
    });

    return () => cancelIdleTask(id);
  }, []);

  return null;
}
