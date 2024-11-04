using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Product.Server.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required(ErrorMessage = "Username is required.")]
        public string Username { get; set; }

        [Required(ErrorMessage = "The password is required.")]
        public string PasswordHash { get; set; } // Nuevo campo para el hash de la contraseña

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "The email is not in a valid format.")]
        public string Email { get; set; }

        public string Role { get; set; } = "user"; // Valor por defecto
        public DateTime? Created { get; set; }  // Valor por defecto
        public DateTime? Modified { get; set; } // Valor por defecto
        public bool? IsActive { get; set; }= true;
        public long? AuthorId { get; set; }
        public long? EditorId { get; set; }

    }
}
