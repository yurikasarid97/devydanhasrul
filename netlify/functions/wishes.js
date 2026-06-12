const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  // GET: ambil semua wishes
  if (event.httpMethod === 'GET') {
    const { data, error } = await supabase
      .from('wishes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {

      console.log("SUPABASE ERROR:");
      console.log(error);
    
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
      };
    }
    return { statusCode: 200, headers, body: JSON.stringify(data) };
  }

  // POST: simpan wish baru
  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body || '{}');
    const { error } = await supabase.from('wishes').insert([{
      name: body.name,
      attend: body.attend,
      msg: body.msg,
      sticker: body.sticker || '',
      date: body.date,
    }]);

    if (error) {

      console.log("SUPABASE ERROR:");
      console.log(error);
    
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
      };
    }
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 405, headers, body: 'Method not allowed' };
};

// let data = []

// exports.handler = async (event) => {

// if(event.httpMethod === "GET"){
// return {
// statusCode:200,
// body: JSON.stringify(data)
// }
// }

// if(event.httpMethod === "POST"){

// const body = JSON.parse(event.body)

// data.push(body)

// return {
// statusCode:200,
// body: JSON.stringify(data)
// }

// }

// return { statusCode:405 }
// }
