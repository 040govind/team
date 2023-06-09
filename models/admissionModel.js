const mongoose=require("mongoose");

const admissionSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    mobile:{
        type:Number,
        require:true
    },
    email:{
        type:String,
        require:true 
    },
    fatherName:{
        type:String,
        require:true
    },
    fatherOccupition:{
        type:String,
        require:true
    },
    motherName:{
        type:String,
        require:true
    },
    motherOccupition:{
        type:String,
        require:true
    },
    income:{
        type:Number,
        require:true
    },
    Caddress:{
        city:{
            type:String,
        },
        state:{
            type:String
        },
        pin:{
            type:Number
        }
    },
    Paddress:{
        city:{
            type:String,
            require:true
        },
        state:{
            type:String,
            require:true
        },
        pin:{
            type:Number,
            require:true
        }
    },
    nationality:{
        type:String,
        require:true
    },
    cast:{
        type:String,
        require:true
    },
    Detail10:{
        nameOfBoard:{
            type:String,
            require:true
        },
        yearOfPassing:{
            type:Number,
            require:true 
        },
        Percentage:{
            type:Number,
            require:true
        }
    },
    Detail12:{
        qulification:{
            type:String,
            require:true
        },
        nameOfBoard:{
            type:String,
            require:true
        },
        yearOfPassing:{
            type:Number,
            require:true 
        },
        Percentage:{
            type:Number,
            require:true
        }
    },
    jobTitle:{
        type:String,
        require:true 
    },
    jobExprience:{
        type:String
    },
    // userImg:{
    //   type:String,
    //   require:true
    // },
    // marksheet10:{
    //     type:String,
    //     require:true
    // },
    // marksheet12:{
    //     type:String,
    //     require:true
    // },
    // ugCertificate:{
    //     type:String,
    //     require:true
    // },
    // pgCertificate:{
    //     type:String
    
    // },
    // identityProof:{
    //     type:String
    // },
    // signature:{
    //     type:String,
    //     require:true 
    // },

    isVerify:{
        type:Boolean,
        require:true
    }

});
module.exports = mongoose.model('UserAdmission',admissionSchema);