'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mic, Send, Volume2 } from 'lucide-react'

const commands = {
  'hello': 'Hello! I am SerenityAI. How can I assist you today?',
  'how are you': "I'm doing well, thank you for asking!",
  'tell me about yourself': "I am SerenityAI, your mental health companion. I am here to provide personalized support, therapy, and resources tailored to your unique needs.",
  'what can you do': "I can offer guided relaxation techniques, daily affirmations, journaling prompts, breathing exercises, goal setting, and resource recommendations to support your mental well-being.",
  'start guided relaxation': "Let's start a guided relaxation session. Close your eyes, take a deep breath, and focus on relaxing each part of your body, starting from your toes and working your way up to your head.",
  'give me a daily affirmation': "You are worthy of love and happiness. Repeat this affirmation throughout the day to boost your confidence and self-esteem.",
  'suggest a journaling prompt': "Reflect on a recent challenge you faced and write about how you overcame it. Journaling can help you gain insights and perspective on your experiences.",
  'practice breathing exercises': "Let's do a calming breathing exercise. Inhale deeply through your nose for 4 seconds, hold your breath for 4 seconds, and exhale slowly through your mouth for 6 seconds. Repeat this cycle for several minutes.",
  'set a mental health goal': "Think about one aspect of your mental health you'd like to improve, such as managing stress or practicing self-care. Set a SMART goal (Specific, Measurable, Achievable, Relevant, Time-bound) to work towards achieving it.",
  'recommend mental health resources': "Here are some mental health resources you might find helpful:\n- BetterHelp\n- Talkspace\n- Mental Health America\n- National Alliance on Mental Illness (NAMI)\n- SAMHSA's National Helpline",
  'tips for managing stress': "Here are some tips for managing stress: 1. Practice mindfulness and meditation. 2. Exercise regularly. 3. Get enough sleep. 4. Connect with loved ones. 5. Set aside time for hobbies and relaxation.",
  'how to improve sleep quality': "To improve sleep quality: 1. Maintain a regular sleep schedule. 2. Create a relaxing bedtime routine. 3. Avoid caffeine and electronics before bed. 4. Make your sleep environment comfortable. 5. Manage stress and anxiety.",
  'how to boost my mood': "To boost your mood: 1. Engage in physical activity. 2. Spend time outdoors. 3. Connect with friends and family. 4. Practice gratitude. 5. Do something you enjoy or try a new hobby.",
  'what are the signs of burnout': "Signs of burnout include: 1. Feeling exhausted all the time. 2. Lack of motivation. 3. Decreased satisfaction and sense of accomplishment. 4. Changes in sleep and appetite. 5. Feeling cynical or detached.",
  'how to practice self-care': "To practice self-care: 1. Prioritize your physical health. 2. Set boundaries and say no when necessary. 3. Engage in activities that bring you joy. 4. Take breaks and rest. 5. Seek support when needed.",
  'crisis helpline': "If you are in crisis, please contact the National Suicide Prevention Lifeline at 1-800-273-TALK (8255) or text HOME to 741741 to reach a trained crisis counselor.",
  'find a therapist': "You can find a therapist through the following resources:\n- Therapy for Black Girls\n- Psychology Today\n- GoodTherapy\n- Open Path Collective\n- Zencare",
  'mental health apps': "Here are some mental health apps that can help:\n- Headspace\n- Calm\n- Moodfit\n- Happify\n- Insight Timer",
}

export default function Home() {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const scrollAreaRef = useRef(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const processCommand = (command) => {
    const response = commands[command.toLowerCase()] || "I'm sorry, I didn't understand that command."
    setMessages(prev => [...prev, { type: 'user', content: command }, { type: 'bot', content: response }])
    speak(response)
  }

  const handleSend = () => {
    if (inputText.trim()) {
      processCommand(inputText)
      setInputText('')
    }
  }

  const startListening = () => {
    setIsListening(true)
    const recognition = new window.webkitSpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      processCommand(transcript)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const speak = (message) => {
    const utterance = new SpeechSynthesisUtterance(message)
    utterance.lang = 'en-US'
    speechSynthesis.speak(utterance)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">SerenityAI - Your Mental Health Companion</h1>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle>Chat with SerenityAI</CardTitle>
                <CardDescription>Ask questions or get support for your mental health</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full rounded-md border p-4" ref={scrollAreaRef}>
                  {messages.map((message, index) => (
                    <div key={index} className={`mb-4 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                      <span className={`inline-block p-2 rounded-lg ${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                        {message.content}
                      </span>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button onClick={handleSend}><Send className="h-4 w-4" /></Button>
                <Button onClick={startListening} disabled={isListening}>
                  {isListening ? <Volume2 className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Mental Health Resources</CardTitle>
                <CardDescription>Helpful links and information for your well-being</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li><a href="https://www.betterhelp.com" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">BetterHelp - Online Counseling</a></li>
                  <li><a href="https://www.talkspace.com" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Talkspace - Online Therapy</a></li>
                  <li><a href="https://www.mhanational.org" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Mental Health America</a></li>
                  <li><a href="https://www.nami.org" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">National Alliance on Mental Illness (NAMI)</a></li>
                  <li><a href="https://www.samhsa.gov/find-help/national-helpline" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">SAMHSA's National Helpline</a></li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 SerenityAI. WebWise-Mirak Oracle, part of Mirakle Group. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
