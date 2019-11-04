using ConteoWIP.Areas.Usuarios.Models;
using System.Linq;
using System.Web.Http;
using System.DirectoryServices.AccountManagement;

namespace Template.Areas.Usuarios.Controllers
{
    public class FiltrosUsuariosController : ApiController
    {
        private UsuariosEntities db = new UsuariosEntities();



        public IQueryable<object> getValor(int tipo, int id1 = 0, int id2 = 0, string strValor = "")
        {
            var userName = User.Identity.Name.Split('\\')[1].ToLower();
            switch (tipo)
            {
                //Retorna los roles de un sistema en especifico
                case 1:
                    var queryRolesUsuario = from dbSistemas in db.Sistemas
                                            join dbRoles in db.Roles on dbSistemas.Id equals dbRoles.Id_sistema
                                            where dbSistemas.Id == id1
                                            select dbRoles;

                    return queryRolesUsuario;

                //Retorna el rol que tiene un empleado
                case 2:
                    var queryRolUsuario = from dbSistemas in db.Sistemas
                                          join dbRoles in db.Roles on dbSistemas.Id equals dbRoles.Id_sistema
                                          join dbUsuarioRoles in db.UsuarioRoles on dbRoles.Id equals dbUsuarioRoles.Id_Rol
                                          where dbSistemas.Id == id1 && dbUsuarioRoles.Id_Usuario == id2
                                          select dbUsuarioRoles;
                    var asd = queryRolUsuario.ToList();
                    return queryRolUsuario;

                //Retorna Usuarios con su rol
                case 3:
                    var queryUsuariosRol = from dbSistemas in db.Sistemas
                                           join dbRoles in db.Roles on dbSistemas.Id equals dbRoles.Id_sistema
                                           join dbUsuarioRoles in db.UsuarioRoles on dbRoles.Id equals dbUsuarioRoles.Id_Rol
                                           join dbUsuarios in db.Usuarios on dbUsuarioRoles.Id_Usuario equals dbUsuarios.Id
                                           where dbSistemas.Id == id1
                                           select new
                                           {
                                               Id = dbUsuarios.Id,
                                               Usuario = dbUsuarios.Usuario,
                                               Correo = dbUsuarios.Email,
                                               Rol = dbRoles.Descripcion,

                                           };
                    return queryUsuariosRol;


                //Revisa si es un usuario existente en la tabla de usuarios, para traer su informacion y no repetir los usuarios
                case 4:
                    var queryUsuario = from dbUsuarios in db.Usuarios
                                       where dbUsuarios.Usuario == strValor
                                       select dbUsuarios;
                    return queryUsuario;

                //Retorna las divisiones que tiene un empleado
                case 5:
                    var queryUsuarioDivisiones = from dbUsuariosDivisiones in db.UsuarioDivisiones
                                                 join dbUsuarios in db.Usuarios on dbUsuariosDivisiones.Id_Usuario equals dbUsuarios.Id
                                                 where dbUsuarios.Usuario == strValor && dbUsuariosDivisiones.Id_Sistema == id1
                                                 select new
                                                 {
                                                     Id = dbUsuariosDivisiones.Id,
                                                     Id_Division = dbUsuariosDivisiones.Id_Division,
                                                     Existe = 1,
                                                     Valor = true
                                                 };
                    return queryUsuarioDivisiones;

                //Retorna  las divisiones que tiene un empleado
                case 6:
                    //var dbUDivisiones = db.UsuarioDivisiones.ToList();

                    var queryDiv = from dbUsuarios in db.Usuarios
                                   join dbUsuDivisiones in db.UsuarioDivisiones on dbUsuarios.Id equals dbUsuDivisiones.Id_Usuario
                                   join dbDivisiones in db.Divisiones on dbUsuDivisiones.Id_Division equals dbDivisiones.Id
                                   where dbUsuDivisiones.Id_Sistema == id1
                                   select new
                                   {
                                       Descripcion = dbDivisiones.Descripcion,
                                       Usuario = dbUsuarios.Usuario,
                                   };

                    //var queryDivisiones = from dbUsuDivisiones in db.UsuarioDivisiones
                    //                      join dbDivisiones in db.Divisiones on dbUsuDivisiones.Id_Division equals dbDivisiones.Id

                    //                      where dbUsuDivisiones.Id_Sistema == id1
                    //                      select new
                    //                      {
                    //                          descripcion = dbDivisiones.Descripcion,
                    //                          usuario = dbUsuDivisiones.Usuario,
                    //                      };
                    //var test = queryDivisiones.ToList();
                    return queryDiv.AsQueryable();

                default:
                    return db.UsuarioRoles;
            }

        }


        public object getInfo(int id1 = 0, int id2 = 0, string strValor = "")
        {
            PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
            UserPrincipal user = UserPrincipal.FindByIdentity(ctx, strValor);
            if (user != null)
            {
                var modelExiste = db.Usuarios.Where(x => x.Usuario == strValor).FirstOrDefault();

                if (modelExiste != null)
                {
                    return Json(new { existe = true, correo = user.EmailAddress, usuario = user.SamAccountName });
                }


                //do something here....     
                var usersSid = user.Sid;

                //not sure what you mean by "username" - the "DisplayName" ? The "SAMAccountName"??
                var strusername = user.DisplayName;
                var userSamAccountName = user.SamAccountName;
                //strCorreo = user.EmailAddress;
                return Json(new { existe = false, correo = user.EmailAddress, usuario = user.SamAccountName });
            }
            else
            {
                return Json(new { existe = false, correo = "", usuario = "" });
            }
        }

        public void delete(int tipo, int id1 = 0, int id2 = 0, string strValor = "")
        {
            switch (tipo)
            {
                case 1:
                    var queryUsuarioDivisiones = from dbUsuario in db.Usuarios
                                                 join dbUsuarioDivisiones in db.UsuarioDivisiones on dbUsuario.Id equals dbUsuarioDivisiones.Id_Usuario
                                                 select dbUsuarioDivisiones;
                    var deleteUsuarioDivisiones = queryUsuarioDivisiones.ToList();

                    //var deleteUsuarioDivisiones = db.UsuarioDivisiones.Where(x => x.Usuario == strValor && x.id_sistema == id1).ToList();
                    db.UsuarioDivisiones.RemoveRange(deleteUsuarioDivisiones);
                    db.SaveChanges();
                    break;
            }
        }
    }

}
