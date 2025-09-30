import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info, AlertTriangle } from "lucide-react";

interface AdmissionAlert {
  id: string;
  title: string;
  message: string;
  alert_type: string;
}

export const AdmissionAlerts = () => {
  const [alerts, setAlerts] = useState<AdmissionAlert[]>([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("admission_alerts")
      .select("*")
      .eq("is_active", true)
      .lte("start_date", today)
      .gte("end_date", today)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setAlerts(data);
    }
  };

  if (alerts.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <AlertCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getVariant = (type: string): "default" | "destructive" => {
    return type === "urgent" ? "destructive" : "default";
  };

  return (
    <div className="space-y-4 mb-8">
      {alerts.map((alert) => (
        <Alert key={alert.id} variant={getVariant(alert.alert_type)}>
          {getIcon(alert.alert_type)}
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
};