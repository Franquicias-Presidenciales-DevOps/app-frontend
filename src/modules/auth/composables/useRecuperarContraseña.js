import { onMounted, ref } from "vue";
import { required, email, minlength } from "@/utils/validations";
import { useRouter } from "vue-router";

// stores
import { useAuthStore } from "@/store/auth";

// services
import auth_service from "@/services/auth.services";

export function useRecuperarPassword() {
  // variables
  const user_var = ref(null);
  const form_input = ref(null);

  const email_var = ref(null);
  const show_alert_var = ref(false);
  const isActive = ref(false);

  // references
  const store_ref = useAuthStore();
  const router_ref = useRouter();

  

  const RULES_CONST = {
    email_var: [required, email],
  };

  const recuperarPasswordFN = async () => {

    
    await form_input.value?.validate();
    if (!form_input.value.isValid) return;


    

    const { data, status } = await auth_service.recuperarPassword({
      email: email_var.value,
    });

    if (status != 200) {
      show_alert_var.value = false;
    } else {
      show_alert_var.value = true;
    }
  };



  return {
    user_var,
    email_var,
    show_alert_var,
    isActive,
    recuperarPasswordFN,
    RULES_CONST,
    form_input,
  };
}
