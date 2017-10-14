class ImageUploaderController
{
	constructor( $auth )
	{
		'ngInject';

		this.$auth = $auth;

		if( !this.label )
			this.label = "Logo hochladen";
	}

	//
	assignImage( $file, $message, $flow )
	{
		if( !this.item )
			this.item = {};

		let image = JSON.parse( $message );

		this.item.image = image;
		this.item.image_id = image.id;
	}

	//
	resetImage( $flow )
	{
		$flow.cancel();

		this.item.image = null;
		this.item.image_id = null;
	}

	upload( $flow )
	{
		$flow.opts.headers = {
				Authorization : 'Bearer ' + this.$auth.getToken()
		};

		$flow.upload();
	}
}

export const ImageUploaderComponent = {
	template: require('./image-uploader.component.html'),
	controller: ImageUploaderController,
	controllerAs: 'vm',
	bindings: {
		item: '=ngModel',
		label: '@'
	}
}
