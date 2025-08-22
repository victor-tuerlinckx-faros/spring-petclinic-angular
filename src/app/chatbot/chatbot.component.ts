import {AfterViewInit, Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ChatbotService} from './chatbot.service';

interface Message {
  content: string;
  sent: boolean;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements AfterViewInit {
  private LSK: string = 'PeClCL';
  chat: Message[] = JSON.parse(localStorage.getItem(this.LSK)) ?? [];
  messageControl: FormControl<string> = new FormControl('', []);

  constructor(private chatbotService: ChatbotService) {
  }

  ngAfterViewInit(): void {
    const textArea = document.getElementById('chat-textarea');
    textArea.addEventListener('keypress', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    textArea.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.restorePreviousPrompt();
      }
    });
  }

  sendMessage() {
    const message = this.messageControl.value;
    this.addMessageToChat({content: message, sent: true});
    this.messageControl.setValue('');
    this.chatbotService.chat(message).subscribe(response => this.addMessageToChat({content: response, sent: false}));
  }

  private addMessageToChat(message: Message) {
    this.chat.push(message);
    localStorage.setItem(this.LSK, JSON.stringify(this.chat));

    setTimeout(() => {
      const history = document.getElementsByClassName('chat-history')[0];
      history.scrollTop = history.scrollHeight;
    }, 50);
  }

  deleteChat() {
    localStorage.removeItem(this.LSK);
    this.chat = [];
  }

  restorePreviousPrompt() {
    const currentValue = this.messageControl.value;
    const previousPrompts = [];
    this.chat.filter(m => m.sent)
      .map(m => m.content)
      .forEach(p => {
        if (!previousPrompts.includes(p)) previousPrompts.push(p)
      });

    if (previousPrompts.length > 0) {
      if (!previousPrompts.includes(currentValue)) {
        this.messageControl.setValue(previousPrompts[previousPrompts.length - 1] ?? currentValue);
      } else {
        const previousIndex = previousPrompts.indexOf(currentValue) - 1;
        this.messageControl.setValue(previousIndex >= 0 ? previousPrompts[previousIndex] : previousPrompts[previousPrompts.length - 1]);
      }
    }
  }
}
