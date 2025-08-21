import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HandleError, HttpErrorHandler} from '../error.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  entityUrl = environment.REST_API_URL + 'chat';
  private readonly handlerError: HandleError;

  constructor(
    private http: HttpClient,
    private httpErrorHandler: HttpErrorHandler
  ) {
    this.handlerError = httpErrorHandler.createHandleError('ChatbotService');
  }

  chat(question: string): Observable<string> {
    return this.http
      .post(this.entityUrl, question, { responseType: 'text' })
      .pipe(catchError(this.handlerError('chat', '[]')));
  }
}
