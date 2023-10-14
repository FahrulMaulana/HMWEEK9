const pool= require('../config/queris');

const getAllmovie = async (req,res)=>{
    pool.query('select*from public.movies',(err,result)=>{
        if (err) {
            throw err
        }
        res.status(200).json(result.rows)
    })
}

const getmovieByid = async (req,res)=>{
    const idmovie = req.params.id
    pool.query('select*from public.movies where id=$1',[idmovie],(err,result)=>{
        if (err) {
            throw err
        }
        res.status(200).json(result.rows)
    })
}


const getmoviePaginate = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;

    try {
        const client = await pool.connect();
        const query = `SELECT * FROM public.movies LIMIT ${limit} OFFSET ${startIndex}`;
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


const updateMovie = async (req, res) => {
    const id = req.params.id;
    const { title, genres, year } = req.body;

    if (!title || !genres || !year) {
        return res.status(400).json({ message: 'Semua kolom harus diisi' });
    }

    const query = 'UPDATE public.movies SET title=$1, genres=$2, year=$3 WHERE id=$4 RETURNING *';
    const values = [title, genres, year, id];

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

const createMovie = async (req, res) => {
    const { id,title, genres, year } = req.body;

    if (!id || !title || !genres || !year) {
        return res.status(400).json({ message: 'Semua kolom harus diisi' });
    }

    const query = 'INSERT INTO public.movies (id, title, genres, year) VALUES ($1, $2, $3,$4) RETURNING *';
    const values = [id, title, genres, year];

    pool.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Terjadi kesalahan dalam menyimpan data' });
        }
        res.status(201).json({ message: 'Film baru telah dibuat', data: result.rows[0] });
    });
};

const deleteMovie = async (req, res) => {
    const id = req.params.id;

    const query = 'DELETE FROM public.movies WHERE id=$1 RETURNING *';
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
    getAllmovie,
    getmovieByid,
    updateMovie,
    createMovie,
    deleteMovie,
    getmoviePaginate
}
