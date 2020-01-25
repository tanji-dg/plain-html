/**
 * @author Benjamin Collins / https://dashgl.com
 */


//------------------------------------------------------------------------------
// Collada Exporter
//------------------------------------------------------------------------------

THREE.JSONColladaExporter = function () {

	var date = new Date();

	this.name = "model";

	this.vertices = [];
	this.normals = [];
	this.uvs = [];
	this.indices = [];

	this.vcount = [];
	this.v = [];
	this.weights =[];

	this.bone_names = [];
	this.bone_joints = [];
	this.bones = [];

	this.output = {
		COLLADA: {
			_version: "1.4.1",
			_xmlns: "http://www.collada.org/2005/11/COLLADASchema",
			asset: {
				contributor: {
					authoring_tool: "Threejs Collada Exporter",
				},
				created: date.toUTCString(),
				up_axis: "Y_UP"
			},
			library_controllers: {},
			library_geometries: {
				geometry: {
					"mesh": {
						"source": [],
						"vertices": {
							"input": {
								"_semantic": "POSITION",
								"_source": "#Geometry-mesh-positions"
							},
							"_id": "Geometry-mesh-vertices"
						}
					},
					"_id": "Geometry-mesh",
					"_name": "Mesh"
				}
			},
			library_images: {
				image: {
					_id: "Image0001",
					_name: "Image0001"
				}
			},
			library_materials: {
				material: {
					instance_effect: {
						_url: "#Effect-Texture"
					},
					_id: "Material-Texture",
					_name: "Texture"
				}
			},
			library_effects: {
				"effect": {
					"profile_COMMON": {
						"newparam": [{
								"surface": {
									"init_from": "Image0001",
									"format": "A8R8G8B8",
									"_type": "2D"
								},
								"_sid": "Image0001-surface"
							},
							{
								"sampler2D": {
									"source": "Image0001-surface",
									"minfilter": "LINEAR_MIPMAP_LINEAR",
									"magfilter": "LINEAR"
								},
								"_sid": "Image0001-sampler"
							}
						],
						"technique": {
							"phong": {
								"diffuse": {
									"texture": {
										"_texture": "Image0001-sampler",
										"_texcoord": "Texture"
									}
								}
							},
							"_sid": "common"
						}
					},
					"_id": "Effect-Texture",
					"_name": "Texture"
				}
			},
			library_visual_scenes: {
				visual_scene: {
					node: [],
					"_id": "DefaultScene"
				}
			},
			scene: {
				instance_visual_scene: {
					_url: "#DefaultScene"
				}
			}
		}
	};

};


THREE.JSONColladaExporter.prototype = {

	constructor: THREE.JSONColladaExporter,

	parse: function (input, options) {

		this.name = input.name;
		this.readGeometry(input.geometry);

		if (input.type === "Mesh") {
			this.writeGeometry();
		} else if (input.type === "SkinnedMesh") {
			this.readSkeleton(input.skeleton);
			this.writeArmature();
			this.writeController();
		}

		this.writeComments();
		this.writeImageName();
		this.writePosition();
		this.writeNormals();
		this.writeTexCoords();
		this.writeTriangles();

		var x2js = new X2JS();
		var xmlAsStr = x2js.json2xml_str(this.output);
		return '<?xml version="1.0" encoding="utf-8" ?>' + xmlAsStr;

	},

	readGeometry: function (geometry) {

		var keys = ["x", "y", "z", "w"];

		// Populate vertices

		for (let i = 0; i < geometry.vertices.length; i++) {
			let x = geometry.vertices[i].x.toFixed(2);
			let y = geometry.vertices[i].y.toFixed(2);
			let z = geometry.vertices[i].z.toFixed(2);
			this.vertices.push(x, y, z);

			let count = 0;
			keys.forEach(idx => {
				if(!geometry.skinWeights[i]) {
					return;
				}

				if(geometry.skinWeights[i][idx] === 0) {
					return;
				}

				count++;
				this.v.push(geometry.skinIndices[i][idx]);
				this.v.push(0);
				//this.weights.push(geometry.skinWeights[i][idx]);
			});

			this.vcount.push(count);

		}

		// Populate normals, uv and indices

		let drawIndex = null;
		let lastMatIndex = null;

		for (var i = 0; i < geometry.faces.length; i++) {

			let face = geometry.faces[i];
			let matIndex = face.materialIndex;

			let normal = geometry.faces[i].normal;
			let uv = geometry.faceVertexUvs[0][i];
			let indices = [face.a, face.b, face.c];
			// Normals

			let nx = normal.x.toString(5);
			let ny = normal.y.toString(5);
			let nz = normal.z.toString(5);
			this.normals.push(nx, ny, nz);

			let n_index = this.normals.length / 3;

			// Texture coords

			for (var k = 0; k < uv.length; k++) {
				let u = (uv[k].x).toFixed(5);
				let v = (1 - uv[k].y).toFixed(5);

				let uv_index = this.uvs.length / 2;
				this.uvs.push(u, v);

				this.indices.push(indices[k], n_index, uv_index);
			}

		}

	},

	readSkeleton : function(skeleton) {
		
		for(let i = 0; i < skeleton.bones.length; i++) {
			
			this.bone_names.push(skeleton.bones[i].name);

			let mtx = skeleton.boneInverses[i].clone();
			mtx.transpose();
			this.bone_joints.push.apply(this.bone_joints, mtx.elements);
			
			let bone = skeleton.bones[i].clone();
			bone.matrix.transpose();
			this.bones.push(bone);

		}
		
	},

	writeGeometry: function () {

		this.output.COLLADA.library_visual_scenes.visual_scene.node.push({
			"instance_geometry": {
				"bind_material": {
					"technique_common": {
						"instance_material": {
							"bind_vertex_input": {
								"_semantic": "Texture",
								"_input_semantic": "TEXCOORD",
								"_input_set": "0"
							},
							"_symbol": "Material-Texture",
							"_target": "#Material-Texture"
						}
					}
				},
				"_url": "#Geometry-mesh"
			},
			"_id": "Geometry-Node",
			"_name": "Mesh",
			"_type": "NODE"
		});

	},

	writeArmature: function () {
		
		this.output.COLLADA.library_visual_scenes.visual_scene.node.push({
			"node": {
				"matrix": {
					"_sid": "transform",
					"__text": this.bones[0].matrix.elements.join(" ")
				},
				"node": [],
				"_id": "Bone000",
				"_name": "Bone000",
				"_sid": "Bone000",
				"_type": "JOINT"
			},
			"_name": "Armature",
			"_type": "NODE"
		}, {
			"instance_controller": {
				"skeleton": "#Bone000",
				"bind_material": {
					"technique_common": {
						"instance_material": {
							"bind_vertex_input": {
								"_semantic": "Texture",
								"_input_semantic": "TEXCOORD",
								"_input_set": "0"
							},
							"_symbol": "Material-Texture",
							"_target": "#Material-Texture"
						}
					}
				},
				"_url": "#Geometry-skin"
			},
			"_name": "Mesh",
			"_type": "NODE"
		});
		
		let ptr = this.output.COLLADA.library_visual_scenes.visual_scene.node;
		for(let i = 0; i < this.bones[0].children.length; i++) {
			
			let node = this.create_bones(this.bones[0].children[i]);
			ptr[0].node.node.push(node);

		}
	
	},

	create_bones: function(bone) {
		
		let mtx = bone.matrix;
		mtx.transpose();

		var dae_bone = {
			"matrix": {
				"_sid": "transform",
				"__text": mtx.elements.join(" ")
			},
			"_id": bone.name,
			"_name": bone.name,
			"_sid": bone.name,
			"_type": "JOINT"
		}
		
		if(!bone.children.length) {
			return dae_bone;
		}
		
		dae_bone.node = [];
		for(let i = 0; i < bone.children.length; i++) {
			dae_bone.node.push(this.create_bones(bone.children[i]));
		}

		return dae_bone;

	},

	writeController: function () {

		this.output.COLLADA.library_controllers.controller = {
			"skin": {
				"bind_shape_matrix": "1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1",
				"source": [{
						"Name_array": {
							"_id": "Geometry-skin-joints-array",
							"_count": this.bone_names.length,
							"__text": this.bone_names.join(" ")
						},
						"technique_common": {
							"accessor": {
								"param": {
									"_name": "JOINT",
									"_type": "name"
								},
								"_source": "#Geometry-skin-joints-array",
								"_count": this.bone_names.length,
								"_stride": "1"
							}
						},
						"_id": "Geometry-skin-joints"
					},
					{
						"float_array": {
							"_id": "Geometry-skin-pose-array",
							"_count": this.bone_joints.length,
							"__text": this.bone_joints.join(" ")
						},
						"technique_common": {
							"accessor": {
								"param": {
									"_name": "TRANSFORM",
									"_type": "float4x4"
								},
								"_source": "#Geometry-skin-pose-array",
								"_count": this.bone_names.length,
								"_stride": "16"
							}
						},
						"_id": "Geometry-skin-pose"
					},
					{
						"float_array": {
							"_id": "Geometry-skin-weights-array",
							"_count": "1",
							"__text": "1"
						},
						"technique_common": {
							"accessor": {
								"param": {
									"_name": "WEIGHT",
									"_type": "float"
								},
								"_source": "#Geometry-skin-weights-array",
								"_count": "1",
								"_stride": "1"
							}
						},
						"_id": "Geometry-skin-weights"
					}
				],
				"joints": {
					"input": [{
							"_semantic": "JOINT",
							"_source": "#Geometry-skin-joints"
						},
						{
							"_semantic": "INV_BIND_MATRIX",
							"_source": "#Geometry-skin-pose"
						}
					]
				},
				"vertex_weights": {
					"input": [{
							"_semantic": "JOINT",
							"_source": "#Geometry-skin-joints",
							"_offset": "0"
						},
						{
							"_semantic": "WEIGHT",
							"_source": "#Geometry-skin-weights",
							"_offset": "1"
						}
					],
					"vcount": this.vcount.join(" "),
					"v": this.v.join(" "),
					"_count": (this.v.length / 2).toString()
				},
				"_source": "#Geometry-mesh"
			},
			"_id": "Geometry-skin"
		}
	},

	writeComments: function (options) {

		let ptr = this.output.COLLADA.asset.contributor;
		ptr.author = "DashGL.com a site for OpenGL tutorials";
		ptr.comments = "Arguments passed to exporter";
		ptr.source_data = "Filename and offset";

	},

	writeImageName: function (materials) {

		let tex_name = this.name + ".png";
		this.output.COLLADA.library_images.image.init_from = tex_name;

	},

	writePosition: function () {

		this.output.COLLADA.library_geometries.geometry.mesh.source.push({
			"float_array": {
				"_id": "Geometry-mesh-positions-array",
				"_count": this.vertices.length.toString(),
				"__text": this.vertices.join(" ")
			},
			"technique_common": {
				"accessor": {
					"param": [{
							"_name": "X",
							"_type": "float"
						},
						{
							"_name": "Y",
							"_type": "float"
						},
						{
							"_name": "Z",
							"_type": "float"
						}
					],
					"_count": (this.vertices.length / 3).toString(),
					"_source": "#Geometry-mesh-positions-array",
					"_stride": "3"
				}
			},
			"_id": "Geometry-mesh-positions",
			"_name": "positions"
		});

	},

	writeNormals: function () {

		this.output.COLLADA.library_geometries.geometry.mesh.source.push({
			"float_array": {
				"_id": "Geometry-mesh-normals-array",
				"_count": this.normals.length.toString(),
				"__text": this.normals.join(" "),
			},
			"technique_common": {
				"accessor": {
					"param": [{
							"_name": "X",
							"_type": "float"
						},
						{
							"_name": "Y",
							"_type": "float"
						},
						{
							"_name": "Z",
							"_type": "float"
						}
					],
					"_count": (this.normals.length / 3).toString(),
					"_source": "#Geometry-mesh-normals-array",
					"_stride": "3"
				}
			},
			"_id": "Geometry-mesh-normals",
			"_name": "normals"
		});

	},

	writeTexCoords: function () {

		this.output.COLLADA.library_geometries.geometry.mesh.source.push({
			"float_array": {
				"_id": "Geometry-mesh-Texture-array",
				"_count": this.uvs.length.toString(),
				"__text": this.uvs.join(" "),
			},
			"technique_common": {
				"accessor": {
					"param": [{
							"_name": "S",
							"_type": "float"
						},
						{
							"_name": "T",
							"_type": "float"
						}
					],
					"_count": (this.uvs.length / 2).toString(),
					"_source": "#Geometry-mesh-Texture-array",
					"_stride": "2"
				}
			},
			"_id": "Geometry-mesh-Texture",
			"_name": "Texture"
		});

	},

	writeTriangles: function () {

		this.output.COLLADA.library_geometries.geometry.mesh.triangles = {
			input: [{
					"_semantic": "VERTEX",
					"_source": "#Geometry-mesh-vertices",
					"_offset": "0"
				},
				{
					"_semantic": "NORMAL",
					"_source": "#Geometry-mesh-normals",
					"_offset": "1"
				},
				{
					"_semantic": "TEXCOORD",
					"_source": "#Geometry-mesh-Texture",
					"_offset": "2",
					"_set": "0"
				}
			],
			p: this.indices.join(" "),
			_count: (this.indices.length / 9),
			_material: "Material-Red"
		};

	}


};
