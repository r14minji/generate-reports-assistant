import { httpClient } from "../lib/axios";

// 예시: Post 타입 정의
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// 예시: 포스트 관련 API 서비스들
export const postService = {
  // 포스트 목록 조회
  getPosts: async (limit: number = 10): Promise<Post[]> => {
    return httpClient.get<Post[]>(`/posts?_limit=${limit}`);
  },

  // 특정 포스트 조회
  getPost: async (id: number): Promise<Post> => {
    return httpClient.get<Post>(`/posts/${id}`);
  },

  // 사용자별 포스트 조회
  getPostsByUser: async (userId: number): Promise<Post[]> => {
    return httpClient.get<Post[]>(`/posts?userId=${userId}`);
  },

  // 새 포스트 생성
  createPost: async (postData: Omit<Post, "id">): Promise<Post> => {
    return httpClient.post<Post, Omit<Post, "id">>("/posts", postData);
  },

  // 포스트 수정
  updatePost: async (
    id: number,
    postData: Partial<Omit<Post, "id">>
  ): Promise<Post> => {
    return httpClient.put<Post, Partial<Omit<Post, "id">>>(
      `/posts/${id}`,
      postData
    );
  },

  // 포스트 부분 수정
  patchPost: async (
    id: number,
    postData: Partial<Omit<Post, "id">>
  ): Promise<Post> => {
    return httpClient.patch<Post, Partial<Omit<Post, "id">>>(
      `/posts/${id}`,
      postData
    );
  },

  // 포스트 삭제
  deletePost: async (id: number): Promise<void> => {
    return httpClient.delete<void>(`/posts/${id}`);
  },
};
