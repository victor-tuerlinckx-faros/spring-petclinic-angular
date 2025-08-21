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
  chat: Message[] = [];
  messageControl: FormControl<string> = new FormControl('', []);

  constructor(private chatbotService: ChatbotService) {
  }

  ngAfterViewInit(): void {
    document.getElementById('chat-textarea').addEventListener('keypress', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
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

    setTimeout(() => {
      const history = document.getElementsByClassName('chat-history')[0];
      history.scrollTop = history.scrollHeight;
    }, 50);
  }
}
