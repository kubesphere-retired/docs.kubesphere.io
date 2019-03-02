---
Title: "Application Repository"
---

KubeSphere built the application repository service based on [OpenPitrix](https://openpitrix.io), which is an open-source application management
platform for multi-cloud environment, be powered by [QingCloud](https://www.qingcloud.com) as well. 
KubeSphere Application Repository supports for Helm application. In the application repository, each application consists of Helm package, which including some manifests and templates.

The application package can be stored into an HTTP/HTTPS server or an S3 object storage. The  application repository is an external storage independent of KubeSphere, which can be QingStor object storage or AWS object storage, where the content is the configuration and template files. Once the repository is registered, the stored application packages are automatically indexed into deployable applications.

## Add the Application Repository

Sign in with cluster admin, then click **Platform Management → App Repository** to enter into the list page.

![application repo](/ae-apprepo_list-en.png)

1. Click **Add App Repository** button.

2. Fill in the basic information of the repository in the pop-up window, and click the **Validate** button.

> Before add the repository into KubeSphere, you have to prepare a backend object storage to store the Helm application package, KubeSphere supports QingStor object storage and AWS S3 object storage.
> - To create QingStor object storage, see [QingStor documentation](https://docs.qingcloud.com/qingstor/guide/bucket_manage.html#%E5%88%9B%E5%BB%BA-bucket), get Key as shown in the [Access Key](https://docs.qingcloud.com/qingstor/api/common/signature.html#%E8%8E%B7%E5%8F%96-access-key). 
> - To create the AWS S3 object storage, Access Key ID and Secret Access Key see [AWS documentation](https://docs.aws.amazon.com/zh_cn/general/latest/gr/managing-aws-access-keys.html).

- App Repository Name: a concise name for the application repository can help users to browse and search.
- type: only support Helm Chart.
- url: supports the following three protocols
    - S3: QingStor Bucket URL is HTTP at the beginning, but can be compatible with the S3 protocol, if URL is matched S3 style `s3.<zone-id>.qingstor.com/<bucket-name>/`, then QingStor service can use S3 interface.
    - http: support read but not support write, only supported for the application of the repository store (object), support deploy to runtime. For example, `http://openpitrix.pek3a.qingstor.com/package/`, the application contains three sample repository and will be automatically imported into the platform after added.
    - https: readable, non-writable, supports only retrieving applications from the application repository (object store) and deploying to the runtime.
- Description: briefly introduce the main features of the application repository, so that users can further understand the application repository;

3. After passing the validation, click **OK** button to save it. Once you add an application repository, it will automatically loads all the application templates of that repository.

![create application repository](/repo-basic-en.png)

Google has two application repositories which includes multiple helm applications. QingStor has made a mirror for the stable one (we will develop a commercial application repository for enterprises bussiness later). Users can add the required application repositories as needed:

> - QingStor Helm Repo: `https://helm-chart-repo.pek3a.qingstor.com/kubernetes-charts/`
> - Google Stable Helm Repo: `https://kubernetes-charts.storage.googleapis.com/`
> - Google Incubator Helm Repo: `https://kubernetes-charts-incubator.storage.googleapis.com/`

In the private cloud scenario within the enterprise, users can build their own application repositories based on [Helm](https://helm.sh) specifications, thus can develop and upload the applications that meet the business requirements of the enterprise to their own application repositories, and then complete the distribution and deployment of the applications based on KubeSphere.