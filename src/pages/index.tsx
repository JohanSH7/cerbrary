"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/organism/loginForm";
import { RegisterForm } from "@/components/organism/registerForm";
import { motion, AnimatePresence } from "framer-motion";
import { useWaitForSession } from "@/hooks/useWaitForSession";

export default function HomePage() {
  const [tab, setTab] = useState("login");

  useWaitForSession(() => {
    window.location.href = "/dashboard";
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffaf0] text-gray-800">
      <div className="flex w-full max-w-6xl mx-auto rounded-lg overflow-hidden">
        {/* Branding */}
        <div className="hidden md:flex flex-col justify-center items-start p-12 w-1/2 bg-transparent">
          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold text-gray-900">CerBrary</h1>
            <p className="text-gray-700 text-lg max-w-md leading-relaxed">
              Bienvenido a <strong>CerBrary</strong>, el sistema inteligente de gestión de bibliotecas inspirado en <em>Cerbero</em>, el guardián del conocimiento. Administra libros, usuarios y préstamos de forma segura, eficiente y moderna.
            </p>
          </div>
        </div>

        {/* Login / Registro con Tabs */}
        <div className="w-full md:w-1/2 px-8 py-10">
          <Card className="w-full shadow-md">
            <CardContent>
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
                        <RegisterForm onSuccess={() => setTab("login")} />
                      </motion.div>
                    </TabsContent>
                  )}
                </AnimatePresence>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
