import { useState } from "react";
import { ScrollView } from "react-native";
import { Section, SectionBody } from "@/components/block/section";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

export const unstable_settings = {
  tabBarButton: () => null, // hides the tab button
};

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await authClient.signUp.email({
      email,
      password,
      name,
    });
  };

  return (
    <>
      <ScrollView>
        <Section>
          <SectionBody>
            <Input
              placeholder="Name"
              keyboardType="default"
              textContentType="name"
              autoComplete="given-name"
              value={name}
              onChangeText={setName}
              className="text-foreground"
            />
            <Input
              placeholder="Email"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
              className="text-foreground"
            />
            <Input
              placeholder="Password"
              keyboardType="visible-password"
              textContentType="password"
              autoComplete="new-password"
              value={password}
              onChangeText={setPassword}
              className="text-foreground"
            />
            <Button onPress={handleLogin} className="w-full">
              <Text>Sign In</Text>
            </Button>
          </SectionBody>
        </Section>
      </ScrollView>
    </>
  );
}
