import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const routes = {
  getAchievementCount: () => '/achievement/stats',
  addComment: (params: string) => `/post/${params}/comment`,
  likePost: (params: string) => `/post/${params}/like`,
  unlikePost: (params: string) => `/post/${params}/dislike`,
  createPost: () => `/post/add`,
  getPostListing: (query: string) => `/posts/list${query}`,
  getAttendance: (query: string) => `/attendance/status${query}`,
  updatePost: (post_id: string) => `/post/${post_id}`,
  deletePost: (post_id: string) => `/post/${post_id}`,
  getCommentListing: (params: string, query: string) =>
    `/post/${params}/comments${query}`,
  createVideoPost: (query: string) => `/video/${query}`,
  updateVideoPost: (video_id: string) => `/video/${video_id}`,
  sendFootMate: (c: SendFootMate) => '/connection/request/send'
};

interface createVideoPostContext {
  requestData: FormData;
  type: 'timeline' | 'learning_or_training' | 'match';
}

interface GetPostListingContext {
  page_no?: number;
  page_size?: number;
  comments?: number;
}

interface GetCommentListingContext {
  post_id: string;
  page_no?: number;
  page_size?: number;
}

interface GetAttendanceListingContext {
  user_id: string;
  lat: number;
  long: number;
}

interface GetAttendanceListingResponseContext {
  status: string;
  message: string;
  data: {
    mark: string;
    suggestion: string;
  };
}

interface GetCommentListingResponseContext {
  status: string;
  message: string;
  data: {
    total: number;
    records: {
      comment: string;
      commented_by: {
        avatar: string;
        member_type: string;
        user_id: string;
        name: string;
        type: string;
        position: string;
      };
      commented_at: string;
    }[];
  };
}

interface GetPostListingResponseContext {
  status: string;
  message: string;
  data: {
    total: number;
    records: {
      id: string;
      caption: string;
      post: {
        text: string;
        media_url: string;
        media_type: string;
        media_thumbnail: {
          sizes: string;
        }[];
        meta?: {
          abilities: {
            ability_name: string;
            attributes: [];
          }[];
          others: [];
        };
      };
      posted_by: {
        avatar: string;
        member_type: string;
        user_id: string;
        name: string;
        type: string;
        position: string;
      };
      is_liked: boolean;
      likes: number;
      comments: {
        total: number;
        data: {
          comment: string;
          commented_by: {
            avatar: string;
            member_type: string;
            user_id: string;
            name: string;
            type: string;
            position: string;
          };
          commented_at: string;
        }[];
      };
      created_at: string;
    }[];
  };
}

interface CommonResponseContext {
  status: string;
  message: string;
}
interface likeUnlikeContext {
  post_id: string;
}
interface countResponseContext {
  data: {
    achievements: number;
    tournaments: number;
  };
}
interface achievementCountContext {
  user_id: string;
}
interface CommonResponseContext {
  status: string;
  message: string;
}
interface AddCommentContext {
  post_id: string;
  comment: string;
}
interface attendaceContext {
  user_id: string;
  lat: number;
  long: number;
}
interface SendFootMate {
  to: string;
}
@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  constructor(private httpClient: HttpClient) {}

  getAchievementCount(
    context: Partial<achievementCountContext>
  ): Observable<countResponseContext> {
    let query = '?';
    if (context['user_id']) {
      query += 'user_id=' + context['user_id'];
      return this.httpClient.get<countResponseContext>(
        routes.getAchievementCount() + query
      );
    }

    return this.httpClient.get<countResponseContext>(
      routes.getAchievementCount()
    );
  }

  addComment(context: AddCommentContext): Observable<CommonResponseContext> {
    let params = '';

    if (context['post_id']) {
      params += `${context['post_id']}`;
    }

    let { comment } = context;

    return this.httpClient.post<CommonResponseContext>(
      routes.addComment(params),
      { comment }
    );
  }

  likePost(context: likeUnlikeContext): Observable<CommonResponseContext> {
    let params = '';
    if (context['post_id']) {
      params += `${context['post_id']}`;
    }
    return this.httpClient.post<CommonResponseContext>(
      routes.likePost(params),
      context
    );
  }

  unlikePost(context: likeUnlikeContext): Observable<CommonResponseContext> {
    let params = '';
    if (context['post_id']) {
      params += `${context['post_id']}`;
    }
    return this.httpClient.post<CommonResponseContext>(
      routes.unlikePost(params),
      context
    );
  }

  createPost(context: any): Observable<any> {
    return this.httpClient.post<any>(routes.createPost(), context);
  }

  updatePost(post_id: string, context: any): Observable<any> {
    return this.httpClient.put<any>(routes.updatePost(post_id), context);
  }

  deletePost(post_id: string): Observable<any> {
    return this.httpClient.delete<any>(routes.deletePost(post_id));
  }

  getPostListing(
    context: GetPostListingContext
  ): Observable<GetPostListingResponseContext> {
    let query = '?';
    if (context['page_no']) {
      query += 'page_no=' + context['page_no'];
    }

    if (context['page_size']) {
      query += '&page_size=' + 100;
    }

    if (context['comments']) {
      query += '&comments=' + context['comments'];
    }

    return this.httpClient.get<GetPostListingResponseContext>(
      routes.getPostListing(query)
    );
  }

  getCommentListing(
    context: GetCommentListingContext
  ): Observable<GetCommentListingResponseContext> {
    let params = '';
    if (context['post_id']) {
      params += `${context['post_id']}`;
    }

    let query = '?';
    if (context['page_no']) {
      query += 'page_no=' + context['page_no'];
    }
    if (context['page_size']) {
      query += '&page_size=' + context['page_size'];
    }

    return this.httpClient.get<GetCommentListingResponseContext>(
      routes.getCommentListing(params, query)
    );
  }

  getAttendance(
    context: GetAttendanceListingContext
  ): Observable<GetAttendanceListingResponseContext> {
    console.log('inside getAttendance 1111111');
    let query = '?';
    if (context['user_id']) {
      query += 'user_id=' + context['user_id'];
    }

    if (context['lat']) {
      query += '&lat=' + context['lat'];
    }

    if (context['long']) {
      query += '&long=' + context['long'];
    }

    return this.httpClient.get<GetAttendanceListingResponseContext>(
      routes.getAttendance(query)
    );
  }

  createVideoPost(context: createVideoPostContext): Observable<any> {
    let query = '?';

    if (context['type']) {
      query += 'type=' + context['type'];
    }

    return this.httpClient.post<CommonResponseContext>(
      routes.createVideoPost(query),
      context.requestData,
      { reportProgress: true, observe: 'events' }
    );
  }

  sendFootMate(context: SendFootMate): Observable<CommonResponseContext> {
    return this.httpClient.post<CommonResponseContext>(
      routes.sendFootMate(context),
      context
    );
  }

  updateVideoPost(
    video_id: string,
    context: createVideoPostContext
  ): Observable<CommonResponseContext> {
    return this.httpClient.put<any>(routes.updateVideoPost(video_id), context);
  }
}
