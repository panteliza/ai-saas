"use client";

import * as z from "zod";

import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import OpenAI from "openai";
import axios from 'axios';


import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Empty} from "@/components/ui/empty";
import { Loader } from "@/components/loader";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";

import { formSchema } from "./constants";

type ExtendedMessage = OpenAI.ChatCompletionMessage & { role: "user" | "assistant" | string };


// Main component for the conversation page
const ConversationPage = () => {
  // Using useRouter for navigation actions
  const router = useRouter();

  // State for storing chat messages
  const [messages, setMessages] = useState<ExtendedMessage[]>([]);


  // Setting up the form with react-hook-form and zod for validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  });

  // Checking if the form is currently being submitted
  const isLoading = form.formState.isSubmitting;
  
  // Function to handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Creating a message object for the user's input
      const userMessage = { role: "user", content: values.prompt };
      // Adding the user message to the existing messages
      const newMessages = [...messages, userMessage];
      
      // Sending the updated message list to the server
      const response = await axios.post('/api/conversation', { messages: newMessages });

      // Updating the state with both the user's message and the server's response
      setMessages((current) => [...current, userMessage, response.data]);
      
      // Resetting the form after submission
      form.reset();
    } catch (error: any) {
      // TODO: Open Pro Model

       // Handling errors, showing a modal on 403 or a toast on other errors
      console.log(error)
      if (error?.response?.status === 403) {

      } else {

      }
    } finally {
      router.refresh();
    }
  }

  // Render function for the component
  return ( 
    <div>
      <Heading
        title="Conversation"
        description="Our most advanced conversation model."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="
                rounded-lg 
                border 
                w-full 
                p-4 
                px-3 
                md:px-6 
                focus-within:shadow-sm
                grid
                grid-cols-12
                gap-2
              "
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading} 
                        placeholder="How do I calculate the radius of a circle?" 
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading} size="icon">
                Generate
              </Button>
            </form>
          </Form>
        </div>

        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="No conversation started." />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message) => (
              <div 
              key={message.content}
              >
                {message.role === "assistant" ? <BotAvatar /> : <UserAvatar />}
                <div
                  className="text-sm overflow-hidden leading-7"
                  dangerouslySetInnerHTML={{
                    __html: message.content
                      ? message.content.replace(/\n/g, "<br />")
                      : "",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
   );
}
 
export default ConversationPage;