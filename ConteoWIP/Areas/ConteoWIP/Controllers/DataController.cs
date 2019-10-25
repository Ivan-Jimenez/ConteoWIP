using System;
using System.Configuration;
using System.Data;
using System.Data.OleDb;
using System.Data.SqlClient;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace ConteoWIP.Areas.ConteoWIP.Controllers
{
    public class DataController : ApiController
    {
        // Upload data from an excel document
        public HttpResponseMessage Post()
        {
            HttpResponseMessage result = null;
            //var httpRequest = HttpContext.Current.Request;

            //if (httpRequest.Files.Count > 0)
            //{
            //    var docfiles = new List<string>();
            //    foreach (string file in httpRequest.Files)
            //    {
            //        var postedFile = httpRequest.Files[file];
            //        var filePath = HttpContext.Current.Server.MapPath("~/Files/" + "uploaded_data");
            //        postedFile.SaveAs(filePath);
            //        docfiles.Add(filePath);
            //    }
            //    result = Request.CreateResponse(HttpStatusCode.Created, UploadFile(docfiles[0]));
            //}
            //else
            //{
            //    result = Request.CreateResponse(HttpStatusCode.BadRequest);
            //}
            result = Request.CreateResponse(HttpStatusCode.Created, UploadFile("~/Files/uploaded_data.xlsx"));
            return result;
        }

        public HttpResponseMessage Get()
        {
            var result = Request.CreateResponse(HttpStatusCode.Created, UploadFile(HttpContext.Current.Server.MapPath("~")+"Files\\uploaded_data.xlsx"));
            //return Request.CreateResponse(HttpStatusCode.Accepted, "It's Fucking Working!");
            return result;
        }

        private string UploadFile(string file)
        {
            DataSet ds = new DataSet();

            try
            {
                // Open SQL connection
                SqlConnection connSql = new SqlConnection();
                connSql.ConnectionString = ConfigurationManager.ConnectionStrings["ConteoWIPEntities"].ConnectionString;
                connSql.Open();

                // Open Excel connection
                OleDbConnection connXls = new OleDbConnection("Provider=Microsoft.ACE.OLEDB.12.0;" +
                        "Data Source=" + file + ";" +
                        "Extended Properties='Excel 12.0 Xml; HDR=YES'");

                // Get the new data from the excel file
                OleDbDataAdapter dataAdapter = new OleDbDataAdapter(@"SELECT * FROM [Conteo$] WHERE [OperationNumber] IS NOT NULL;", connXls);
                dataAdapter.Fill(ds);
                SqlBulkCopy bulkCopy = new SqlBulkCopy(connSql);
                bulkCopy.DestinationTableName = "Counts";
                
                // Map columns 
                bulkCopy.ColumnMappings.Add(ds.Tables[0].Columns["Product"].ToString(), "Product");
                bulkCopy.ColumnMappings.Add(ds.Tables[0].Columns["Alias"].ToString(), "Alias");
                bulkCopy.ColumnMappings.Add(ds.Tables[0].Columns["ProductName"].ToString(), "ProductName");
                bulkCopy.ColumnMappings.Add(ds.Tables[0].Columns["AreaLine"].ToString(), "AreaLine");
                bulkCopy.ColumnMappings.Add(ds.Tables[0].Columns["OperationNumber"].ToString(), "OperationNumber");
                bulkCopy.ColumnMappings.Add(ds.Tables[0].Columns["OperationDescription"].ToString(), "OperationDescription");
                bulkCopy.ColumnMappings.Add(ds.Tables[0].Columns["OrderNumber"].ToString(), "OrderNumber");
                bulkCopy.ColumnMappings.Add(ds.Tables[0].Columns["OrdQty"].ToString(), "OrdQty");
                bulkCopy.ColumnMappings.Add(ds.Tables[0].Columns["Physical"].ToString(), "Physical1");
                bulkCopy.ColumnMappings.Add(ds.Tables[0].Columns["Result"].ToString(), "Result");
                bulkCopy.ColumnMappings.Add(ds.Tables[0].Columns["FinalResult"].ToString(), "FinalResult");
                bulkCopy.ColumnMappings.Add(ds.Tables[0].Columns["Comments"].ToString(), "Comments");
                bulkCopy.ColumnMappings.Add(ds.Tables[0].Columns["ReCount"].ToString(), "ReCount");
                
                // Delete old data
                //new SqlCommand("DELETE Nacionales;", connSql).ExecuteNonQuery();

                bulkCopy.WriteToServer(ds.Tables[0]);
                return "OK";
            }
            catch (Exception ex)
            {
                return "Error: " + ex.Message + " : " + ex.StackTrace;
            }
        }
    }
}