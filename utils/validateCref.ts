export function validateCref(cref: string): { valid: boolean; message?: string } {
  const regex = /^\d{6}-[A-Z]\/[A-Z]{2}$/;
  const validUfs = ['AC','AL','AP', /*...*/ 'TO'];
  
  if (!regex.test(cref)) {
    return { valid: false, message: 'Formato inválido. Use: 123456-G/UF' };
  }
  
  const uf = cref.split('/')[1];
  return validUfs.includes(uf) 
    ? { valid: true } 
    : { valid: false, message: 'UF inválido' };
}