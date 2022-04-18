## 기술 스택
- 언어 : Typescript
- 프레임워크 : Express
- Database : mysql(amazon rds), typeORM

## Backend
- 로그인 구현
  - JWT을 사용, Cookie에 저장
  - JWT는 `username` 암호화하여 저장하므로 사용자 인증이 필요할 시, payload값을 이용해 유저를 확인
- 게시판 기능
  - CRUD 기능
    - 글 쓰기
    - 글 삭제
    - 글 수정
  - 페이지 네이션
    - 한번에 불러올 게시글 수(Limit) - 10

## Frontend
Backend를 메인으로 하여 기능을 구현하고 프론트 부분은 필요한 부분만 React를 공부하여 기능 구현
Frontend github 주소 : [Frontend github](https://github.com/hotkimho/board_express_front)
- 사용자 인증
  - `Redux`, `ContextAPI`를 사용하기 어려워 전역적으로 로그인 여부를 확인하기 힘들기 때문에 `Cookie`에 토큰을 저장하고 읽어와 사용자 인증
- 게시판
  - `React-bootstrap`를 사용해 최소한의 UI만 구현

## API
  - Get
    - `localhost/board`
      - 게시판 메인 페이지, 1페이지에 있는 게시글들을 반환
    - `localhost/board/:postId/post`
      - postId를 parameter로 받아 해당 게시글의 정보를 반환
  - Post
    - `localhost/auth/signup`
      - username, password를 입력받아 회원가입을 진행(username은 고유한 값)
    - `localhost/auth/login`
      - username, password를 입력받아 로그인을 진행
        - 정상적인 로그인이면 JWT 반환
    - `localhost/board/post`
      - title, content를 입력받아 게시글을 생성함
  - Patch
    - `localhost/board/post`
      - title, content 수정된 값들을 받아 게시글을 수정
  - Delete
    - `localhost/board/post`
      - postId Querystring를 받아 해당 게시글을 삭제

## Entity
```typescript
@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  updated_at: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
```
`User` 모델은 `Post` 모델과 `OneToMany(1:N)`관계를 가진다.
`PK` 값은 `id` 컬럼이고 로그인에 사용되는 값은 `username` 이다

```typescript
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  writer: string;

  @Column()
  view: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;
}
```
`Post` 모델은 `User` 모델과 `ManyToOne(N:1)` 관계를 가진다.
`PK`는 `id` 컬럼이며, `User`모델과 관계를 맺으면 `userId`값이 `FK` 로 자동으로 생성된다.

## 보완할 점
- 인증
  - 현재 방식은 JWT값을 `Cookie`에 저장하여 사용한다. 이러면 JWT값이 유출되면 문제가 생길 수 있다.
  이를 해결하기 위해 `AccessToken`, `RefreshToken` 방식으로 인증을 수정
- 언어 및 프레임워크
  - `Typescript`를 제대로 사용하지 못한것 같음
  - Service, Controller, Route를 제대로 분리하여 코드를 작성하지 못함
  - `Nestjs`로 이 프로젝트를 변경해보는것도 좋을듯
- 프론트 영역
  - 프론트 지식이 부족해 프론트 영역에서 미리 차단하는 부분을 구현하지 못함.(alert로 표시)