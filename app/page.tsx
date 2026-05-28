'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import { format, addDays, isSameDay, isWeekend } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, Calendar as CalendarIcon, CheckCircle, User, Video, Globe } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

const AVAILABLE_TIMES = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setConfirmed(false);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setConfirmed(false);
  };

  const handleConfirm = () => {
    setConfirmed(true);
  };

  const tileDisabled = ({ date }: { date: Date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || isWeekend(date);
  };

  if (confirmed && selectedDate && selectedTime) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Agendamento Confirmado!</h2>
          <p className="text-gray-600 mb-6">
            Sua consulta foi agendada para{' '}
            <strong className="text-gray-900">
              {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </strong>{' '}
            às <strong className="text-gray-900">{selectedTime}</strong>.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-center gap-3 mb-2">
              <User className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">Cláudio Fernandes</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Video className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">Google Meet</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">America/Sao_Paulo</span>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedDate(null);
              setSelectedTime(null);
              setConfirmed(false);
            }}
            className="w-full py-3 px-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Agendar outro horário
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left side - Event details */}
            <div className="p-8 bg-gray-900 text-white">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                <User className="w-4 h-4" />
                <span>Cláudio Fernandes</span>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">Consulta de 30 min</h1>
              
              <div className="flex items-center gap-2 text-gray-300 mb-6">
                <Clock className="w-5 h-5" />
                <span>30 minutos</span>
              </div>
              
              <p className="text-gray-400 mb-8">
                Uma conversa rápida para discutir seu projeto, tirar dúvidas ou 
                explorar como posso ajudar você a alcançar seus objetivos.
              </p>
              
              <div className="border-t border-gray-800 pt-6">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Globe className="w-4 h-4" />
                  <span>America/Sao_Paulo (Brasília)</span>
                </div>
              </div>
            </div>

            {/* Right side - Calendar and time selection */}
            <div className="p-8">
              {!selectedDate ? (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    Selecione uma data
                  </h2>
                  <div className="custom-calendar">
                    <Calendar
                      onChange={(value) => handleDateSelect(value as Date)}
                      value={selectedDate}
                      tileDisabled={tileDisabled}
                      minDate={new Date()}
                      locale="pt-BR"
                      className="w-full border-0"
                    />
                  </div>
                </div>
              ) : !selectedTime ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                    </h2>
                    <button
                      onClick={() => setSelectedDate(null)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Voltar
                    </button>
                  </div>
                  <p className="text-gray-600 mb-4">Selecione um horário:</p>
                  <div className="space-y-2">
                    {AVAILABLE_TIMES.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className="w-full py-3 px-4 text-left border border-gray-200 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-colors"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Confirmar agendamento
                    </h2>
                    <button
                      onClick={() => setSelectedTime(null)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Voltar
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarIcon className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-900 font-medium">
                        {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-900 font-medium">{selectedTime}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleConfirm}
                    className="w-full py-3 px-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Confirmar agendamento
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
