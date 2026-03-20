import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) =>
{
  const router = inject(Router);

  // --- AGGIUNTA DEL TOKEN (LOGICA IN USCITA) ---
  // se la richiesta è per il login, non aggiungere il token
  // perché è lui che genera il token — non ne ha bisogno
  let authReq = req;
  if (!req.url.includes('/users/login'))
  {
    const token = localStorage.getItem('token');
    if (token)
    {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }

  // --- GESTIONE ERRORE (LOGICA IN ENTRATA) ---
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      // Se il server risponde 401 o 403 su qualsiasi altra richiesta
      if (error.status === 401 || error.status === 403)
      {
        console.error('Sessione scaduta o non autorizzata. Reindirizzamento...');
        localStorage.removeItem('token');
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
