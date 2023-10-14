const pool= require('../config/queris');

const getAlluser = async (req,res)=>{
    pool.query('select*from public.users',(err,result)=>{
        if (err) {
            throw err
        }
        res.status(200).json(result.rows)
    })
}

const getuserPaginate = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;

    try {
        const client = await pool.connect();
        const query = `SELECT * FROM public.users LIMIT ${limit} OFFSET ${startIndex}`;
        const { rows } = await client.query(query);
        client.release();

        const result = {};
        result.result = rows;

        if (startIndex > 0) {
            result.previous = {
                page: page - 1,
                limit: limit,
            }
        }
        if (rows.length === limit) {
            result.next = {
                page: page + 1,
                limit: limit,
            }
        }

        res.json(result);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ message: 'Terjadi kesalahan dalam memperoleh data' });
    }
}


const getuserByid = async (req,res)=>{
    const id = req.params.id
    pool.query('select*from public.users where id=$1',[id],(err,result)=>{
        if (err) {
            throw err
        }
        res.status(200).json(result.rows)
    })
}

const updateuser = async (req, res) => {
    const id = req.params.id;
    const { email, gender, password,role } = req.body;

    if (!email || !gender || !password || !role ) {
        return res.status(400).json({ message: 'Semua kolom harus diisi' });
    }

    const query = 'UPDATE public.users SET email=$1, gender=$2, password=$3 ,role=$4 WHERE id=$5 RETURNING *';
    const values = [email, gender, password, role, id];

    pool.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Terjadi kesalahan dalam memperbarui data' });
        }
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }
        res.status(200).json({ message: 'Data berhasil diperbarui', data: result.rows[0] });
    });
};

const createuser = async (req, res) => {
    const { id, email, gender, password, role } = req.body;

    if (!id || !email || !gender || !password || !role) {
        return res.status(400).json({ message: 'Semua kolom harus diisi' });
    }

    const query = 'INSERT INTO public.users (id, email, gender, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [id, email, gender, password, role];

    pool.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Terjadi kesalahan dalam menyimpan data' });
        }
        res.status(201).json({ message: 'user baru telah dibuat', data: result.rows[0] });
    });
};

const deleteuser = async (req, res) => {
    const id = req.params.id;

    const query = 'DELETE FROM public.users WHERE id=$1 RETURNING *';
    const values = [id];

    pool.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Terjadi kesalahan dalam menghapus data' });
        }
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }
        res.status(200).json({ message: 'Data berhasil dihapus', data: result.rows[0] });
    });
};

module.exports = {
    getAlluser,
    getuserByid,
    updateuser,
    createuser,
    deleteuser,
    getuserPaginate
}
