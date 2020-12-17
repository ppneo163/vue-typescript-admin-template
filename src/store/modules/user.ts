import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import { login, logout } from '@/api/users';
import router, { resetRouter } from '@/router';
import { PermissionModule } from './permission';
import { TagsViewModule } from './tags-view';
import store from '@/store';
import { getToken, getUser, removeToken, removeUser, setToken, setUser } from '@/utils/local-storage';
import { Message } from 'element-ui';

export interface IUserState {
  token: string
  user: any
  roles: string[]
  name: string
  avatar: string
  introduction: string
  email: string
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public user = getUser() || null
  public roles: any[] = []
  public ossPath = ''
  public name = ''
  public avatar = ''
  public introduction = ''
  public email = ''
  public id = ''
  public shopId = ''
  public idCard = ''
  public phone = ''
  public userSex = ''
  public userState = ''

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token;
  }

  @Mutation
  private SET_USER(user: any) {
    this.user = user;
    this.ossPath = user.ossPath + '/';
    this.shopId = user.shopId;
    const userVo = user.userVO;
    if (userVo) {
      this.name = userVo.userName;
      this.avatar = this.ossPath + userVo.userAvatar;
      this.introduction = userVo.introduction;
      this.email = userVo.userEmail;
      this.id = userVo.id;
      this.idCard = userVo.idCard;
      this.phone = userVo.phone;
      this.userSex = userVo.userSex === '0' ? '男' : '女';
      this.userState = userVo.userState === '0' ? '停用' : '启用';
    } else {
      Message.error('用户信息缺失');
      throw Error('用户信息缺失');
    }
    if (this.userState === '停用') {
      Message.error('用户已停用');
      throw Error('用户已停用');
    }
  }

  @Mutation
  private SET_ROLES(roles: any[]) {
    this.roles = roles;
  }

  @Action
  public async Login(userInfo: { username: string, password: string, shopId: any}) {
    let { username, password, shopId } = userInfo;
    username = username.trim();
    const { data } = await login({ phone: username, password, shopId });
    setToken(data.authToken.accessToken);
    setUser(data);
    this.SET_TOKEN(data.authToken.accessToken);
    this.SET_USER(data);
  }

  @Action
  public ResetToken() {
    removeToken();
    this.SET_TOKEN('');
    this.SET_ROLES([]);
  }

  @Action
  public async GetUserRoles() {
    if (!this.token) {
      Message.error('用户token不存在');
      throw Error('用户token不存在');
    }
    if (!this.user) {
      Message.error('用户校验失败');
      throw Error('用户校验失败');
    }
    let roles: any[] = [];
    if (this.user.userVO) {
      roles = this.user.userVO.roleIdList || [];
    }
    if (roles.length !== 0) {
      this.SET_ROLES(roles.concat(['admin']));
    } else {
      Message.error('用户无任何权限');
      throw Error('用户无任何权限');
    }
  }

  @Action
  public async ChangeRoles(role: string) {
    // Dynamically modify permissions
    const token = role + '-token';
    this.SET_TOKEN(token);
    setToken(token);
    await this.GetUserRoles();
    resetRouter();
    // Generate dynamic accessible routes based on roles
    PermissionModule.GenerateRoutes(this.roles);
    // Add generated routes
    router.addRoutes(PermissionModule.dynamicRoutes);
    // Reset visited views and cached views
    TagsViewModule.delAllViews();
  }

  @Action
  public async LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!');
    }
    await logout();
    removeToken();
    removeUser();
    resetRouter();

    // Reset visited views and cached views
    TagsViewModule.delAllViews();
    this.SET_TOKEN('');
    this.SET_ROLES([]);
  }
}

export const UserModule = getModule(User);
