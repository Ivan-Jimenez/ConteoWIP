using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.OleDb;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace ConteoWIP.Areas.ConteoWIP.Controllers
{
    public class DataController : ApiController
    {
        // Upload data from an excel document
        public HttpResponseMessage Post()
        {
            HttpResponseMessage result = null;
            result = Request.CreateResponse(HttpStatusCode.Created, UploadFile("~/Files/uploaded_data.xlsx"));
            return result;
        }

        public HttpResponseMessage Get()
        {
            var result = Request.CreateResponse(HttpStatusCode.Created, UploadFile(HttpContext.Current.Server.MapPath("~")+"Files\\data_wip_and_bins.xlsx"));
            return result;
        }

        // Download data as an excel document
        [ResponseType(typeof(void))]
        public HttpResponseMessage Get(string area, string count_type)
        {
            var httpRequest = HttpContext.Current.Request;
            var name = httpRequest.Params[0];
            ExportDataToExcel(name, count_type);
            return Request.CreateResponse(HttpStatusCode.Accepted, "The file has been downloaded!");
        }

        private void ExportDataToExcel(string area, string count_type)
        {
            string conn = ConfigurationManager.ConnectionStrings["ConteoWIPEntities"].ConnectionString;
            using (SqlConnection sqlConn = new SqlConnection(conn))
            {
                string query;

                if (count_type.Equals("Count"))
                    query = String.Format("SELECT Product, OrderNumber, OperationDescription, OrdQty FROM Counts WHERE AreaLine='{0}' AND Physical1 != OrdQty;", area);
                else
                    query = String.Format("SELECT Product, OrderNumber, OperationDescription, OrdQty FROM Counts WHERE AreaLine='{0}' AND ReCount != OrdQty;", area);

                SqlCommand cmmd = new SqlCommand(query, sqlConn);
                using (var adapter = new SqlDataAdapter(cmmd))
                {
                    var discrepancies = new DataTable();
                    adapter.Fill(discrepancies);
                    ExcelPackage excel = new ExcelPackage();
                    var workSheet = excel.Workbook.Worksheets.Add(area);
                    workSheet.Cells["A1"].LoadFromDataTable(discrepancies, true);

                    using (var memoryStream = new MemoryStream())
                    {
                        HttpContext.Current.Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                        HttpContext.Current.Response.AddHeader("content-disposition", "attachment;  filename=" + area.ToLower() + "_discrepancies_data.xlsx");
                        excel.SaveAs(memoryStream);
                        memoryStream.WriteTo(HttpContext.Current.Response.OutputStream);
                        HttpContext.Current.Response.Flush();
                        HttpContext.Current.Response.End();
                    }
                }
            }
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
                OleDbDataAdapter dataAdapter = new OleDbDataAdapter(@"SELECT * FROM [WIP$] WHERE [OperationNumber] IS NOT NULL;", connXls);
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
                bulkCopy.ColumnMappings.Add(ds.Tables[0].Columns["StdCost"].ToString(), "StdCost");

                // Delete old data
                new SqlCommand("DELETE Counts;", connSql).ExecuteNonQuery();

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