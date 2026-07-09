const db = require("../config/db");

exports.createReview = (req, res) => {

    const userId = req.user.id;

    const { booking_id, rating, komentar } = req.body;

    // cek booking

    const sqlBooking = `
        SELECT *
        FROM booking
        WHERE id = ?
        AND user_id = ?
        AND status='selesai'
    `;

    db.query(sqlBooking,[booking_id,userId],(err,result)=>{

        if(err){

            return res.status(500).json({
                success:false,
                message:err.message
            });

        }

        if(result.length==0){

            return res.status(400).json({

                success:false,

                message:"Booking belum selesai"

            });

        }

        const booking=result[0];

        const sqlReview=`

        INSERT INTO reviews
        (
            booking_id,
            user_id,
            tukang_id,
            rating,
            komentar
        )

        VALUES
        (?,?,?,?,?)

        `;

        db.query(

            sqlReview,

            [

                booking.id,

                userId,

                booking.tukang_id,

                rating,

                komentar

            ],

            (err)=>{

                if(err){

                    return res.status(500).json({

                        success:false,

                        message:err.message

                    });

                }

                res.json({

                    success:true,

                    message:"Review berhasil ditambahkan"

                });

            }

        );

    });

};