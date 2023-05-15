//Modificado
import Whatsapp from "../models/Whatsapp";

interface MyAuthenticationCreds {
  encKey: Buffer;
  macKey: Buffer;
}

export const authStateLegacy = async (whatsapp: Whatsapp) => {
  const updateWhatsappData = await Whatsapp.findOne({
    where: {
      id: whatsapp.id
    }
  });

  let state: MyAuthenticationCreds;

  if (updateWhatsappData?.session) {
    state = JSON.parse(updateWhatsappData.session, (key, value) => {
      if (key === 'encKey' || key === 'macKey') {
        return Buffer.from(value, 'base64');
      }
      return value;
    });
  } else {
    state = {
      encKey: Buffer.from('FEEDFACEDEADBEEFFEEDFACEDEADBEEF', 'hex'),
      macKey: Buffer.from('FEEDFACEDEADBEEFFEEDFACEDEADBEEF', 'hex')
    }
  }

  return {
    state,
    saveState: async () => {
      const str = JSON.stringify(state, (key, value) => {
        if (key === 'encKey' || key === 'macKey') {
          return value.toString('base64');
        }
        return value;
      }, 2);
      await whatsapp.update({
        session: str
      });
    }
  };
};

export default authStateLegacy;
