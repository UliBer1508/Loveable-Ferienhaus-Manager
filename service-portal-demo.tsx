'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Clock, Shirt, Bed, Bath, Plus, ArrowRight, Sparkles, Droplets } from 'lucide-react'

export default function ServicePortalDemo() {
  const [selectedService, setSelectedService] = useState<'cleaning' | 'laundry'>('cleaning')
  const [draggedTask, setDraggedTask] = useState<string | null>(null)

  // 5. Service-spezifische Anpassungen
  const serviceThemes = {
    cleaning: {
      primary: 'from-blue-500 to-cyan-500',
      secondary: 'bg-blue-50 border-blue-200',
      accent: 'text-blue-600',
      icon: Sparkles
    },
    laundry: {
      primary: 'from-green-500 to-emerald-500', 
      secondary: 'bg-green-50 border-green-200',
      accent: 'text-green-600',
      icon: Droplets
    }
  }

  const theme = serviceThemes[selectedService]
  const ServiceIcon = theme.icon

  const cleaningTasks = [
    { id: '1', title: 'Badezimmer reinigen', status: 'pending', progress: 0, items: ['Dusche', 'WC', 'Waschbecken'] },
    { id: '2', title: 'Küche säubern', status: 'in-progress', progress: 60, items: ['Herd', 'Spüle', 'Arbeitsflächen'] },
    { id: '3', title: 'Schlafzimmer', status: 'completed', progress: 100, items: ['Betten machen', 'Staubsaugen'] }
  ]

  const laundryItems = [
    { id: '1', type: 'Bettwäsche', count: 4, icon: Bed, status: 'pending' },
    { id: '2', type: 'Handtücher', count: 8, icon: Bath, status: 'in-progress' },
    { id: '3', type: 'Kleidung', count: 12, icon: Shirt, status: 'completed' }
  ]

  // 7. Interaktive Elemente - Drag & Drop
  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId)
  }

  const handleDrop = (newStatus: string) => {
    if (draggedTask) {
      console.log(`Task ${draggedTask} moved to ${newStatus}`)
      setDraggedTask(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Service-spezifischer Header */}
      <div className={`bg-gradient-to-r ${theme.primary} text-white p-6`}>
        <div className="flex items-center gap-3 mb-4">
          <ServiceIcon className="h-8 w-8" />
          <h1 className="text-2xl font-bold">
            {selectedService === 'cleaning' ? 'Reinigungsportal' : 'Wäscheportal'}
          </h1>
        </div>
        
        {/* Service Switcher */}
        <div className="flex gap-2">
          <Button 
            variant={selectedService === 'cleaning' ? 'secondary' : 'ghost'}
            onClick={() => setSelectedService('cleaning')}
            className="text-white hover:bg-white/20"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Reinigung
          </Button>
          <Button 
            variant={selectedService === 'laundry' ? 'secondary' : 'ghost'}
            onClick={() => setSelectedService('laundry')}
            className="text-white hover:bg-white/20"
          >
            <Droplets className="h-4 w-4 mr-2" />
            Wäsche
          </Button>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto">
        {/* 6. Mobile-First: Statistik Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className={theme.secondary}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${theme.accent}`}>3</div>
              <div className="text-sm text-gray-600">Offen</div>
            </CardContent>
          </Card>
          <Card className={theme.secondary}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${theme.accent}`}>12</div>
              <div className="text-sm text-gray-600">Erledigt</div>
            </CardContent>
          </Card>
        </div>

        {/* Service-spezifische Inhalte */}
        {selectedService === 'cleaning' ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Reinigungsaufgaben</h2>
            {cleaningTasks.map((task) => (
              <Card 
                key={task.id}
                className="transition-all duration-200 hover:shadow-md active:scale-95"
                draggable
                onDragStart={() => handleDragStart(task.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium">{task.title}</h3>
                    <Badge variant={
                      task.status === 'completed' ? 'default' : 
                      task.status === 'in-progress' ? 'secondary' : 'outline'
                    }>
                      {task.status === 'completed' ? 'Erledigt' : 
                       task.status === 'in-progress' ? 'In Arbeit' : 'Offen'}
                    </Badge>
                  </div>
                  
                  {/* Progress Bar */}
                  <Progress value={task.progress} className="mb-3" />
                  
                  {/* Checkliste */}
                  <div className="space-y-2">
                    {task.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className={`h-4 w-4 ${
                          idx < task.progress / 50 ? 'text-green-500' : 'text-gray-300'
                        }`} />
                        <span className={idx < task.progress / 50 ? 'line-through text-gray-500' : ''}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Wäsche-Artikel</h2>
            {laundryItems.map((item) => {
              const ItemIcon = item.icon
              return (
                <Card 
                  key={item.id}
                  className="transition-all duration-200 hover:shadow-md active:scale-95"
                  draggable
                  onDragStart={() => handleDragStart(item.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${theme.secondary}`}>
                        <ItemIcon className={`h-6 w-6 ${theme.accent}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.type}</h3>
                        <p className="text-sm text-gray-600">{item.count} Stück</p>
                      </div>
                      <Badge variant={
                        item.status === 'completed' ? 'default' : 
                        item.status === 'in-progress' ? 'secondary' : 'outline'
                      }>
                        {item.status === 'completed' ? 'Fertig' : 
                         item.status === 'in-progress' ? 'Wäsche' : 'Warten'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* 6. Mobile-First: Floating Action Button */}
        <div className="fixed bottom-6 right-6">
          <Button 
            size="lg" 
            className={`rounded-full h-14 w-14 shadow-lg bg-gradient-to-r ${theme.primary} hover:shadow-xl transition-all duration-200`}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* 7. Interaktive Elemente: Swipe-Hinweis */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-700">
            <ArrowRight className="h-4 w-4" />
            <span className="text-sm">Tipp: Karten nach rechts wischen für Status-Änderung</span>
          </div>
        </div>

        {/* 7. Drag & Drop Zonen (Demo) */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          {['Offen', 'In Arbeit', 'Erledigt'].map((status) => (
            <div
              key={status}
              className="p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-500 min-h-[60px] flex items-center justify-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(status.toLowerCase())}
            >
              {status}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
