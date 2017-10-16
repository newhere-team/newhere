export class UserService
{
	/**
	 *
	 * @param {Restangular} API
	 * @param {ToastService} ToastService
	 * @param {AuthProvider} $auth
	 * @param {*} $q
	 */
	constructor( API,
	             $auth,
	             $q, )
	{
		'ngInject';

		//
		this.API = API;
		this.$auth = $auth;
		this.$q = $q;

		// --------------------------- //

		//
		this.user = null;

		this.roles = [];
		this.providers = [];

		//
		if( this.$auth.isAuthenticated() )
		{
			this.fetchUser();
			this.fetchProviders();
		}
	}

	/**
	 * @param user {email,password}
	 */
	login( user )
	{
		return this.$auth.login( user )
			.then( ( response ) =>
				{
					this.$auth.setToken( response.data );
				},
				( error ) =>
				{
					throw error;
				} )
			.then( () =>
				{
					return this.fetchUser()
				},
				( error ) =>
				{
					throw error;
				} )
			.then( () =>
				{
					return this.fetchProviders()
				},
				( error ) =>
				{
					throw error;
				} )
			;
	}

	//
	fetchUser()
	{
		this.roles.length = 0;

		return this.API.one( 'cms/users/me' ).get()
			.then( ( response ) =>
				{
					this.user = response;

					this.roles.push.apply( this.roles, this.user.roles );
					console.log("roles:", this.roles );

					//
					this.user.roles = [];

					for( let j = 0; j < this.roles.length; j++ )
						this.user.roles.push( this.roles[j].name );
				},
				( error ) =>
				{
					throw error;
				} );
	}

	//
	fetchProviders()
	{
		this.providers.length = 0;

		return this.API.all( 'cms/providers' ).getList()
			.then( ( response ) =>
				{
					this.providers.push.apply( this.providers, response );
					console.log("providers:", this.providers );
				},
				( error ) =>
				{
					throw error;
				} );
	}

	/**
	 * Check whether user holds organisation role (but no superadmin/admin roles)
	 * @returns {boolean}
	 */
	isNgoUser()
	{
		if( !this.user )
			return false;

		let isOrgAdmin = Boolean( this.user.roles.indexOf( "organisation-admin" ) > -1);
		let isOrgUser = Boolean( this.user.roles.indexOf( "organisation-user" ) > -1);
		let isSuperAdmin = Boolean( this.user.roles.indexOf( "superadmin" ) > -1);
		let isAdmin = this.user.roles.indexOf( "admin" ) > -1;

		return (isOrgAdmin || isOrgUser && !isSuperAdmin && !isAdmin);
	}

	//
	isAdministrator()
	{
		if( !this.user )
			return false;

		let isSuperAdmin = Boolean( this.user.roles.indexOf( "superadmin" ) > -1);
		let isAdmin = this.user.roles.indexOf( "admin" ) > -1;

		return isSuperAdmin || isAdmin;
	}

	//
	isModerator()
	{
		if( !this.user )
			return false;

		return ( this.user.roles.indexOf( 'moderator' ) > -1);
	}
}