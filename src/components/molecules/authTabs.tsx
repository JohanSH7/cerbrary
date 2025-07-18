import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import { LoginForm } from "@/components/organism/loginForm";
import { RegisterForm } from "@/components/organism/registerForm";
import { useState } from "react";

export const AuthTabs = () => {
  const [tab, setTab] = useState("login");

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
        <TabsTrigger value="register">Registrarse</TabsTrigger>
      </TabsList>

      <AnimatePresence mode="wait">
        {tab === "login" ? (
          <TabsContent value="login" forceMount>
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
            >
              <LoginForm />
            </motion.div>
          </TabsContent>
        ) : (
          <TabsContent value="register" forceMount>
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
            >
              <RegisterForm switchToLogin={() => setTab("login")} />
            </motion.div>
          </TabsContent>
        )}
      </AnimatePresence>
    </Tabs>
  );
};
