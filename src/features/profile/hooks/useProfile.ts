import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { fetchProfileData, updateProfile } from "../service/profileService"; 
import { 
  UserRole, 
  FormState, 
  Property, 
  RealStateFormFields, 
  UserFormFields 
} from "../../../libs/types";

interface UseProfileResult {
  userRole: UserRole;
  form: FormState;
  userProperties: Property[];
  loading: boolean;
  message: string;
  refetchData: () => Promise<void>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const initialFormState: FormState = {
  firstName: "", lastName: "", phone: "", name: "", address: "", website: "", auth_provider: ""
};

export function useProfile(): UseProfileResult {
  const { data: session, status } = useSession();
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [userProperties, setUserProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const refetchData = useCallback(async () => {
    if (status !== "authenticated") return; 
    setLoading(true);
    try {
      const data = await fetchProfileData();
      
      const role = data.role as UserRole;
      setUserRole(role);
      
      const provider = session?.user?.provider || "email";
      
      if (role === 'USER') {
        setForm({
          firstName: data.firstName || "", lastName: data.lastName || "", phone: data.phone || "",
          name: "", address: "", website: "",
          auth_provider: provider
        });
        setUserProperties(data.properties || []); 
      } else if (role === 'REALSTATE' && data.agencyData) {
        setForm({
          firstName: data.firstName || "", lastName: data.lastName || "", 
          phone: data.agencyData.phone || data.phone || "", 
          name: data.agencyData.name || "", address: data.agencyData.address || "", website: data.agencyData.website || "",
          auth_provider: provider
        });
        setUserProperties(data.agencyData.properties || []); 
      }
      setMessage(""); 

    } catch (error: any) {
      console.error("Error al cargar datos:", error);
      setMessage(`Error al cargar el perfil: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.provider, status]); 

  useEffect(() => {
    if (status === "authenticated") {
      refetchData();
    }
  }, [status, refetchData]); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole === null) return;

    setLoading(true);
    setMessage("");

    try {
      let payload: RealStateFormFields | UserFormFields;

      if (userRole === 'REALSTATE') {
        payload = { 
          name: form.name, address: form.address, phone: form.phone, website: form.website 
        } as RealStateFormFields;
      } else {
        payload = { 
          firstName: form.firstName, lastName: form.lastName, phone: form.phone 
        } as UserFormFields;
      }
      
      await updateProfile(payload, userRole);
      
      setMessage("✅ Perfil actualizado correctamente");
      await refetchData(); 

    } catch (err: any) {
      console.error("Error al actualizar:", err);
      setMessage(`⚠️ ${err.message || "Error en la petición de actualización"}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    userRole,
    form,
    userProperties,
    loading,
    message,
    refetchData,
    handleChange,
    handleSubmit
  };
}