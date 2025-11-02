import { useState, useEffect } from 'react';

interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

interface PushNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  scheduledFor?: Date;
  sent: boolean;
}

export const useNotifications = (userId?: string) => {
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    denied: false,
    default: true
  });
  const [isSupported, setIsSupported] = useState(false);
  const [notifications, setNotifications] = useState<PushNotification[]>([]);

  useEffect(() => {
    // Verificar suporte a notificações
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    
    // Verificar permissão atual
    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      setPermission({
        granted: currentPermission === 'granted',
        denied: currentPermission === 'denied',
        default: currentPermission === 'default'
      });
    }

    // Carregar notificações salvas
    loadSavedNotifications();
  }, [userId]);

  const loadSavedNotifications = () => {
    const saved = localStorage.getItem(`notifications_${userId || 'demo'}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed);
      } catch (error) {
        console.error('Erro ao carregar notificações salvas:', error);
      }
    }
  };

  const saveNotifications = (notifs: PushNotification[]) => {
    localStorage.setItem(`notifications_${userId || 'demo'}`, JSON.stringify(notifs));
    setNotifications(notifs);
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('Notificações não suportadas neste navegador');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      
      setPermission({
        granted: result === 'granted',
        denied: result === 'denied',
        default: result === 'default'
      });

      return result === 'granted';
    } catch (error) {
      console.error('Erro ao solicitar permissão para notificações:', error);
      return false;
    }
  };

  const sendNotification = (
    title: string,
    options: {
      body?: string;
      icon?: string;
      badge?: string;
      tag?: string;
      silent?: boolean;
      requireInteraction?: boolean;
    } = {}
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!permission.granted) {
        console.warn('Permissão para notificações não concedida');
        resolve(false);
        return;
      }

      try {
        const notification = new Notification(title, {
          body: options.body,
          icon: options.icon || '/favicon.ico',
          badge: options.badge || '/favicon.ico',
          tag: options.tag,
          silent: options.silent || false,
          requireInteraction: options.requireInteraction || false
        });

        // Salvar no histórico
        const newNotification: PushNotification = {
          id: Date.now().toString(),
          title,
          body: options.body || '',
          icon: options.icon,
          badge: options.badge,
          tag: options.tag,
          sent: true
        };

        saveNotifications([...notifications, newNotification]);

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        resolve(true);
      } catch (error) {
        console.error('Erro ao enviar notificação:', error);
        resolve(false);
      }
    });
  };

  const sendWelcomeNotification = async () => {
    await sendNotification('Bem-vindo ao EcoPoints! 🌱', {
      body: 'Comece reciclando e ganhe pontos para subir no ranking!',
      requireInteraction: true
    });
  };

  const sendRecyclingReminder = async () => {
    await sendNotification('Hora de reciclar! ♻️', {
      body: 'Você não reciclou hoje. Que tal ganhar alguns pontos?',
      tag: 'daily-reminder'
    });
  };

  const sendLevelUpNotification = async (newLevel: string) => {
    await sendNotification('Parabéns! Você subiu de nível! 🎉', {
      body: `Agora você é ${newLevel}! Continue reciclando!`,
      requireInteraction: true
    });
  };

  const sendBadgeUnlockedNotification = async (badgeName: string) => {
    await sendNotification('Nova badge desbloqueada! 🏅', {
      body: `Você conquistou: ${badgeName}`,
      requireInteraction: true
    });
  };

  const sendMissionCompleteNotification = async (missionName: string, points: number) => {
    await sendNotification('Missão concluída! ✅', {
      body: `${missionName} - Você ganhou ${points} pontos!`,
      requireInteraction: true
    });
  };

  const scheduleRecyclingReminders = () => {
    // Configurar lembretes diários (exemplo: 18:00)
    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(18, 0, 0, 0);

    // Se já passou das 18h hoje, agendar para amanhã
    if (now.getTime() > reminderTime.getTime()) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeUntilReminder = reminderTime.getTime() - now.getTime();

    setTimeout(() => {
      sendRecyclingReminder();
      
      // Reagendar para o próximo dia
      setInterval(() => {
        sendRecyclingReminder();
      }, 24 * 60 * 60 * 1000); // 24 horas
      
    }, timeUntilReminder);
  };

  const sendEmailNotification = async (
    email: string,
    type: 'welcome' | 'reminder' | 'achievement' | 'newsletter',
    data: any = {}
  ): Promise<boolean> => {
    // Em um app real, isso seria uma chamada para sua API de email
    console.log(`📧 Email enviado para ${email}:`, { type, data });
    
    // Simular envio
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  };

  const setupPushNotifications = async (): Promise<boolean> => {
    if (!permission.granted) {
      const granted = await requestPermission();
      if (!granted) return false;
    }

    // Configurar lembretes automáticos
    scheduleRecyclingReminders();
    
    // Enviar notificação de boas-vindas
    setTimeout(() => {
      sendWelcomeNotification();
    }, 2000);

    return true;
  };

  const getNotificationHistory = (): PushNotification[] => {
    return notifications.filter(n => n.sent).sort((a, b) => 
      parseInt(b.id) - parseInt(a.id)
    );
  };

  const clearNotificationHistory = () => {
    localStorage.removeItem(`notifications_${userId || 'demo'}`);
    setNotifications([]);
  };

  const testNotification = async () => {
    await sendNotification('Teste de Notificação 🧪', {
      body: 'Se você viu isso, as notificações estão funcionando!',
      requireInteraction: true
    });
  };

  return {
    permission,
    isSupported,
    notifications: getNotificationHistory(),
    requestPermission,
    sendNotification,
    sendWelcomeNotification,
    sendRecyclingReminder,
    sendLevelUpNotification,
    sendBadgeUnlockedNotification,
    sendMissionCompleteNotification,
    sendEmailNotification,
    setupPushNotifications,
    clearNotificationHistory,
    testNotification,
    hasPermission: permission.granted
  };
};